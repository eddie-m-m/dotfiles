"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommandArguments = exports.getCurrentPath = exports.isFileUri = void 0;
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const configuration_1 = require("./configuration");
function isFileUri(uri) {
    return uri.scheme === 'file';
}
exports.isFileUri = isFileUri;
function getCurrentPath(fileUri) {
    const wsfolder = vscode.workspace.getWorkspaceFolder(fileUri);
    return (wsfolder && wsfolder.uri.fsPath) || path.dirname(fileUri.fsPath);
}
exports.getCurrentPath = getCurrentPath;
// extract argument to an array
function getCommandArguments(fileName) {
    let commandArguments = ['--stdin', fileName, '--force-exclusion'];
    const extensionConfig = (0, configuration_1.getConfig)();
    if (extensionConfig.configFilePath !== '') {
        const found = [extensionConfig.configFilePath]
            .concat((vscode.workspace.workspaceFolders || []).map((ws) => path.join(ws.uri.path, extensionConfig.configFilePath)))
            .filter((p) => fs.existsSync(p));
        if (found.length == 0) {
            vscode.window.showWarningMessage(`${extensionConfig.configFilePath} file does not exist. Ignoring...`);
        }
        else {
            if (found.length > 1) {
                vscode.window.showWarningMessage(`Found multiple files (${found}) will use ${found[0]}`);
            }
            const config = ['--config', found[0]];
            commandArguments = commandArguments.concat(config);
        }
    }
    return commandArguments;
}
exports.getCommandArguments = getCommandArguments;
//# sourceMappingURL=helper.js.map