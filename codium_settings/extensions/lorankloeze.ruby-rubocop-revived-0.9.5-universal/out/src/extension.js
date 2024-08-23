"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const rubocop_1 = require("./rubocop");
const configuration_1 = require("./configuration");
const channel_1 = require("./channel");
// entry point of extension
function activate(context) {
    'use strict';
    (0, channel_1.log)("activate");
    const diag = vscode.languages.createDiagnosticCollection('ruby');
    context.subscriptions.push(diag);
    const rubocop = new rubocop_1.Rubocop(diag);
    const disposable = vscode.commands.registerCommand('ruby.rubocop', (onComplete) => {
        const document = vscode.window.activeTextEditor.document;
        rubocop.execute(document, onComplete);
    });
    context.subscriptions.push(disposable);
    const ws = vscode.workspace;
    ws.onDidChangeConfiguration((0, configuration_1.onDidChangeConfiguration)(rubocop));
    ws.textDocuments.forEach((e) => {
        rubocop.execute(e);
    });
    ws.onDidOpenTextDocument((e) => {
        rubocop.execute(e);
    });
    ws.onWillSaveTextDocument(() => {
        rubocop.executeAutocorrectOnSave();
    });
    ws.onDidSaveTextDocument((e) => {
        if (rubocop.isOnSave) {
            rubocop.execute(e);
        }
    });
    ws.onDidCloseTextDocument((e) => {
        rubocop.clear(e);
    });
    vscode.languages.registerDocumentFormattingEditProvider('ruby', rubocop.formattingProvider);
    vscode.languages.registerDocumentFormattingEditProvider('gemfile', rubocop.formattingProvider);
    vscode.languages.registerCodeActionsProvider('ruby', rubocop.quickFixProvider);
    vscode.languages.registerCodeActionsProvider('gemfile', rubocop.quickFixProvider);
    const autocorrectDisposable = vscode.commands.registerCommand('ruby.rubocop.autocorrect', (...args) => {
        rubocop.executeAutocorrect(args, () => vscode.commands.executeCommand('ruby.rubocop'));
    });
    context.subscriptions.push(autocorrectDisposable);
    const disableCopDisposable = vscode.commands.registerCommand('ruby.rubocop.disableCop', (workspaceFolder, copName) => {
        if (workspaceFolder === null || copName === null)
            return;
        rubocop.disableCop(workspaceFolder, copName, () => vscode.commands.executeCommand('ruby.rubocop'));
    });
    context.subscriptions.push(disableCopDisposable);
    //
    // command for showing our output channel
    //
    context.subscriptions.push(vscode.commands.registerCommand('ruby.rubocop.showOutputChannel', () => channel_1.channel?.show()));
    (0, channel_1.log)("activated");
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map