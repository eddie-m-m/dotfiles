"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rubocop = void 0;
const cp = require("child_process");
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const taskQueue_1 = require("./taskQueue");
const configuration_1 = require("./configuration");
const rubocopAutocorrectProvider_1 = require("./rubocopAutocorrectProvider");
const helper_1 = require("./helper");
const rubocopQuickFixProvider_1 = require("./rubocopQuickFixProvider");
const channel_1 = require("./channel");
class Rubocop {
    constructor(diagnostics, additionalArguments = []) {
        this.taskQueue = new taskQueue_1.TaskQueue();
        this.diag = diagnostics;
        this.additionalArguments = additionalArguments;
        this.config = (0, configuration_1.getConfig)();
        this.formattingProvider = new rubocopAutocorrectProvider_1.default();
        this.quickFixProvider = new rubocopQuickFixProvider_1.default(this.diag);
    }
    disableCop(workspaceFolder, copName, onComplete) {
        const disableCopContent = `
${copName}:
  Enabled: false
`;
        const rubocopYamlPath = path.join(workspaceFolder.uri.fsPath, '.rubocop.yml');
        fs.appendFile(rubocopYamlPath, disableCopContent, () => {
            if (onComplete)
                onComplete();
        });
    }
    executeAutocorrectOnSave() {
        const document = vscode.window.activeTextEditor?.document;
        if (document === null || document === undefined)
            return false;
        if ((document.languageId !== 'gemfile' && document.languageId !== 'ruby') || document.isUntitled || !(0, helper_1.isFileUri)(document.uri))
            return false;
        if (!this.isOnSave || !this.autocorrectOnSave)
            return false;
        return this.executeAutocorrect();
    }
    executeAutocorrect(additionalArguments = [], onComplete) {
        const promise = vscode.window.activeTextEditor?.edit((editBuilder) => {
            const document = vscode.window.activeTextEditor.document;
            const edits = this.formattingProvider.getAutocorrectEdits(document, additionalArguments);
            // We only expect one edit from our formatting provider.
            if (edits.length === 1) {
                const edit = edits[0];
                editBuilder.replace(edit.range, edit.newText);
            }
            if (edits.length > 1) {
                throw new Error('Unexpected error: Rubocop document formatter returned multiple edits.');
            }
        });
        if (onComplete)
            promise.then(() => onComplete());
        return true;
    }
    execute(document, onComplete) {
        if ((document.languageId !== 'gemfile' && document.languageId !== 'ruby') ||
            document.isUntitled ||
            !(0, helper_1.isFileUri)(document.uri)) {
            // git diff has ruby-mode. but it is Untitled file.
            return;
        }
        const fileName = document.fileName;
        const uri = document.uri;
        const currentPath = (0, helper_1.getCurrentPath)(uri);
        const onDidExec = (error, stdout, stderr) => {
            this.reportError(error, stderr);
            const rubocop = this.parse(stdout);
            if (rubocop === undefined || rubocop === null) {
                return;
            }
            try {
                this.diag.delete(uri);
            }
            catch (e) {
                console.debug('Deleting diagnostics failed');
            }
            const entries = [];
            rubocop.files.forEach((file) => {
                const diagnostics = [];
                file.offenses.forEach((offence) => {
                    const loc = offence.location;
                    const range = new vscode.Range(loc.line - 1, loc.column - 1, loc.line - 1, loc.length + loc.column - 1);
                    const sev = this.severity(offence.severity);
                    const correctableString = offence.correctable ? '[Correctable]' : '';
                    const message = offence.message;
                    const diagnostic = new vscode.Diagnostic(range, message, sev);
                    diagnostic.source = `${correctableString}(${offence.severity}:${offence.cop_name})`;
                    diagnostics.push(diagnostic);
                });
                entries.push([uri, diagnostics]);
            });
            try {
                this.diag.set(entries);
            }
            catch (e) {
                console.debug('Adding diagnostics failed');
            }
        };
        const jsonOutputFormat = ['--format', 'json'];
        const args = (0, helper_1.getCommandArguments)(fileName)
            .concat(this.additionalArguments)
            .concat(jsonOutputFormat);
        if (this.config.useServer) {
            args.push('--server');
        }
        const task = new taskQueue_1.Task(uri, (token) => {
            const process = this.executeRubocop(args, document.getText(), { cwd: currentPath }, (error, stdout, stderr) => {
                if (token.isCanceled) {
                    return;
                }
                onDidExec(error, stdout, stderr);
                token.finished();
                if (onComplete) {
                    onComplete();
                }
            });
            return () => process.kill();
        });
        this.taskQueue.enqueue(task);
    }
    get isOnSave() {
        return this.config.onSave;
    }
    get autocorrectOnSave() {
        return this.config.autocorrectOnSave;
    }
    clear(document) {
        const uri = document.uri;
        if ((0, helper_1.isFileUri)(uri)) {
            this.taskQueue.cancel(uri);
            this.diag.delete(uri);
        }
    }
    // execute rubocop
    executeRubocop(args, fileContents, options, cb) {
        const cmd = `${this.config.command} ${args.join(' ')}`;
        (0, channel_1.log)(`executeRubocop: ${cmd}`);
        let child;
        if (this.config.useBundler) {
            child = cp.exec(cmd, options, cb);
        }
        else {
            child = cp.execFile(this.config.command, args, options, cb);
        }
        (0, channel_1.log)("executeRubocop: done");
        child.stdin.write(fileContents);
        child.stdin.end();
        return child;
    }
    // parse rubocop(JSON) output
    parse(output) {
        let rubocop;
        if (output.length < 1) {
            const message = `command ${this.config.command} returns empty output! please check configuration.`;
            vscode.window.showWarningMessage(message);
            return null;
        }
        try {
            const json = output.replace(/^RuboCop server starting on.*?\n/, '');
            rubocop = JSON.parse(json);
        }
        catch (e) {
            (0, channel_1.log)("JSON.parse failed");
            if (e instanceof SyntaxError) {
                const message = output.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t");
                const errorMessage = `Error on parsing output (It might non-JSON output) : "${message}"`;
                vscode.window.showWarningMessage(errorMessage);
                return null;
            }
        }
        return rubocop;
    }
    // checking rubocop output has error
    reportError(error, stderr) {
        const errorOutput = stderr.toString();
        if (error && error.code === 'ENOENT') {
            vscode.window.showWarningMessage(`${this.config.command} is not executable`);
            return true;
        }
        else if (error && error.code === 127) {
            vscode.window.showWarningMessage(stderr);
            return true;
        }
        else if (errorOutput.length > 0 && !this.config.suppressRubocopWarnings) {
            vscode.window.showWarningMessage(stderr);
            return true;
        }
        return false;
    }
    severity(sev) {
        switch (sev) {
            case 'refactor':
                return vscode.DiagnosticSeverity.Hint;
            case 'convention':
            case 'info':
                return vscode.DiagnosticSeverity.Information;
            case 'warning':
                return vscode.DiagnosticSeverity.Warning;
            case 'error':
                return vscode.DiagnosticSeverity.Error;
            case 'fatal':
                return vscode.DiagnosticSeverity.Error;
            default:
                return vscode.DiagnosticSeverity.Error;
        }
    }
}
exports.Rubocop = Rubocop;
//# sourceMappingURL=rubocop.js.map