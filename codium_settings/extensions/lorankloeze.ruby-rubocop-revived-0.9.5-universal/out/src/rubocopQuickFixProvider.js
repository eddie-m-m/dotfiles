"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const configuration_1 = require("./configuration");
const initialWhitespaceRegexp = /^\s+/;
const correctableDiagnosticRegexp = /^\[Correctable\]/;
// Group 1 is the name of the cop
const copFromDiagnosticSourceRegexp = /\([a-z]+:((\w|\/)+)\)$/;
// Group 1 is the code without the comment
// Group 5 is the comment
const rubyCommentRegexp = /^[\t ]*([^#"'\r\n]("(\\"|[^"])*"|'(\\'|[^'])*'|[^#\n\r])*)(#([^#\r\n]*))?/;
// Group 2 is the list of cop names
const rubocopDisableRegexp = /# rubocop:disable (((\w|\/)+)(,\s+((\w|\/)+))*)/;
// Group 2 is the list of cop names
const rubocopEnableRegexp = /# rubocop:enable (((\w|\/)+)(,\s+((\w|\/)+))*)/;
const known_rubocop_departments = [
    'bundler',
    'gemspec',
    'layout',
    'lint',
    'metrics',
    'migration',
    'naming',
    'security',
    'style',
];
class RubocopQuickFixProvider {
    constructor(diagnostics) {
        this.diag = diagnostics;
    }
    // This method is called whenever a rubocop warning
    // is hovered or when the cursor's position is changed.
    provideCodeActions(document, range) {
        const fileDiagnostics = this.diag.get(document.uri);
        if (fileDiagnostics === undefined || fileDiagnostics === null || fileDiagnostics.length == 0)
            return null;
        const appliedDiagnostics = fileDiagnostics.filter((diagnostic) => {
            return undefined !== diagnostic.range.intersection(range);
        });
        let quickFixes = [];
        appliedDiagnostics.forEach((diagnostic) => {
            quickFixes = quickFixes.concat(this.createQuickFixes(document, diagnostic));
        });
        const anyDiagnosticAutocorrectable = -1 !== appliedDiagnostics.findIndex((diagnostic) => {
            return diagnostic.source?.match(correctableDiagnosticRegexp) !== null;
        });
        if (anyDiagnosticAutocorrectable) {
            quickFixes.push(this.forceFixingAll());
            quickFixes.push(this.fixAllSafely());
        }
        return quickFixes;
    }
    createQuickFixes(document, diagnostic) {
        const quickFixes = [];
        const copName = this.extractCopName(diagnostic);
        if (copName === null)
            return quickFixes;
        const autocorrectQuickFix = this.autocorrectCopInFile(copName, diagnostic);
        if (autocorrectQuickFix !== null)
            quickFixes.push(autocorrectQuickFix);
        const config = (0, configuration_1.getConfig)();
        if (!config.hideDisableSuggestions) {
            const ignoreCopForLineQuickFix = this.ignoreCopForLineQuickFix(document, copName, diagnostic);
            if (ignoreCopForLineQuickFix !== null)
                quickFixes.push(ignoreCopForLineQuickFix);
            quickFixes.push(this.disableCopForFileQuickFix(document, copName, diagnostic));
            const disableCopInRubocopYaml = this.disableCopInRubocopYaml(document, copName, diagnostic);
            if (disableCopInRubocopYaml !== null)
                quickFixes.push(disableCopInRubocopYaml);
        }
        const showDocumentationQuickFix = this.showCopDocumentation(copName, diagnostic);
        if (showDocumentationQuickFix !== null)
            quickFixes.push(showDocumentationQuickFix);
        return quickFixes;
    }
    forceFixingAll() {
        const quickFix = new vscode.CodeAction('Fix all warnings', vscode.CodeActionKind.QuickFix);
        quickFix.command = {
            command: 'ruby.rubocop.autocorrect',
            title: 'Fix all warnings',
            arguments: ['-A']
        };
        return quickFix;
    }
    fixAllSafely() {
        const quickFix = new vscode.CodeAction(`Fix all warnings (safely)`, vscode.CodeActionKind.QuickFix);
        quickFix.command = {
            command: 'ruby.rubocop.autocorrect',
            title: `Fix all warnings (safely)`
        };
        return quickFix;
    }
    showCopDocumentation(copName, diagnostic) {
        const copNameArray = copName.split('/');
        const copDepartment = copNameArray[0].toLowerCase();
        if (!known_rubocop_departments.includes(copDepartment))
            return null;
        const copId = copNameArray[1].toLowerCase();
        const docsUri = `https://docs.rubocop.org/rubocop/cops_${copDepartment}.html#${copDepartment}${copId}`;
        const quickFix = new vscode.CodeAction(`Show documentation for \`${copName}\``, vscode.CodeActionKind.QuickFix);
        quickFix.command = {
            command: 'vscode.open',
            title: `Show documentation for \`${copName}\``,
            arguments: [docsUri]
        };
        quickFix.diagnostics = [diagnostic];
        return quickFix;
    }
    autocorrectCopInFile(copName, diagnostic) {
        const correctableMatch = diagnostic.source?.match(correctableDiagnosticRegexp);
        if (correctableMatch === null || correctableMatch === undefined)
            return null;
        const quickFix = new vscode.CodeAction(`Fix \`${copName}\``, vscode.CodeActionKind.QuickFix);
        quickFix.command = {
            command: 'ruby.rubocop.autocorrect',
            title: `Fix \`${copName}\``,
            arguments: ['-A', '--only', copName]
        };
        quickFix.diagnostics = [diagnostic];
        return quickFix;
    }
    disableCopInRubocopYaml(document, copName, diagnostic) {
        if (vscode.workspace.workspaceFolders === undefined || vscode.workspace.workspaceFolders === null)
            return null;
        const currentWorkspaceFolder = vscode.workspace.workspaceFolders.find((workspaceFolder) => {
            return document.uri.path.includes(workspaceFolder.uri.path);
        });
        if (currentWorkspaceFolder === undefined || currentWorkspaceFolder === null)
            return null;
        const quickFix = new vscode.CodeAction(`Disable (project) \`${copName}\``, vscode.CodeActionKind.QuickFix);
        quickFix.diagnostics = [diagnostic];
        quickFix.command = {
            command: 'ruby.rubocop.disableCop',
            title: `Disable (project) \`${copName}\` in \`.rubocop.yml\``,
            arguments: [currentWorkspaceFolder, copName]
        };
        return quickFix;
    }
    disableCopForFileQuickFix(document, copName, diagnostic) {
        const quickFix = new vscode.CodeAction(`Disable (file) \`${copName}\``, vscode.CodeActionKind.QuickFix);
        const edit = new vscode.WorkspaceEdit();
        const lineCount = document.lineCount;
        const firstLine = document.lineAt(0);
        const lastLine = document.lineAt(lineCount - 2);
        const rubocopDisableMatch = firstLine.text.match(rubocopDisableRegexp);
        if (rubocopDisableMatch !== undefined && rubocopDisableMatch !== null) {
            edit.replace(document.uri, firstLine.range, `${rubocopDisableMatch[0]}, ${copName}`);
        }
        else {
            edit.insert(document.uri, new vscode.Position(0, 0), `# rubocop:disable ${copName}\n`);
        }
        const rubocopEnableMatch = lastLine.text.match(rubocopEnableRegexp);
        if (rubocopEnableMatch !== undefined && rubocopEnableMatch !== null) {
            edit.replace(document.uri, lastLine.range, `${rubocopEnableMatch[0]}, ${copName}`);
        }
        else {
            edit.insert(document.uri, new vscode.Position(lineCount, 0), `\n# rubocop:enable ${copName}\n`);
        }
        quickFix.edit = edit;
        quickFix.command = { command: 'ruby.rubocop', title: 'Lint the file with Rubocop' };
        quickFix.diagnostics = [diagnostic];
        return quickFix;
    }
    ignoreCopForLineQuickFix(document, copName, diagnostic) {
        const quickFix = new vscode.CodeAction(`Ignore (line) \`${copName}\``, vscode.CodeActionKind.QuickFix);
        const lineNumber = diagnostic.range.start.line;
        const lineText = document.lineAt(lineNumber).text;
        let newCommentStartCharacter = lineText.length;
        let newCommentText = ` # rubocop:disable ${copName}`;
        const initialWhitespace = lineText.match(initialWhitespaceRegexp) || '';
        const existingCommentMatch = lineText.match(rubyCommentRegexp);
        if (existingCommentMatch === null || existingCommentMatch === undefined)
            return null;
        const existingCommentText = existingCommentMatch[5];
        const codeWithoutComment = `${initialWhitespace}${existingCommentMatch[1]}`;
        if (codeWithoutComment.length === 0)
            return null;
        if (existingCommentText !== undefined && existingCommentText !== null) {
            newCommentStartCharacter = 0;
            const rubocopDisableMatch = existingCommentText.match(rubocopDisableRegexp);
            if (rubocopDisableMatch !== undefined && rubocopDisableMatch !== null) {
                newCommentText = `${codeWithoutComment}${rubocopDisableMatch[0]}, ${copName}`;
            }
            else {
                newCommentText = `${codeWithoutComment}${newCommentText.substring(1)}`;
            }
        }
        const edit = new vscode.WorkspaceEdit();
        const editRange = new vscode.Range(new vscode.Position(lineNumber, newCommentStartCharacter), new vscode.Position(lineNumber, newCommentStartCharacter + newCommentText.length));
        edit.replace(document.uri, editRange, newCommentText);
        quickFix.edit = edit;
        quickFix.command = { command: 'ruby.rubocop', title: 'Lint the file with Rubocop' };
        quickFix.diagnostics = [diagnostic];
        return quickFix;
    }
    extractCopName(diagnostic) {
        const matches = diagnostic.source?.match(copFromDiagnosticSourceRegexp);
        if (matches === null || matches === undefined)
            return null;
        return matches[1];
    }
}
exports.default = RubocopQuickFixProvider;
//# sourceMappingURL=rubocopQuickFixProvider.js.map