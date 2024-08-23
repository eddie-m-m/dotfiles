"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
/**
 * This extension helps to manage crate dependency versions.
 */
const vscode_1 = require("vscode");
const replaceVersion_1 = require("./commands/replacers/replaceVersion");
const updateAll_1 = require("./commands/replacers/updateAll");
const generateCurrentVulnReport_1 = require("./commands/report-generator/generateCurrentVulnReport");
const generateVulnerabilityReport_1 = require("./commands/report-generator/generateVulnerabilityReport");
const retry_1 = require("./commands/retry");
const config_1 = require("./config");
const Language_1 = require("./core/Language");
const listener_1 = __importDefault(require("./core/listeners/listener"));
const WelcomePanel_1 = require("./panels/WelcomePanel");
const storage_1 = require("./storage");
function activate(context) {
    console.debug('Congratulations, your extension "dependi" is now active! AAAA');
    // Add commands
    // Load settings and listen for changes
    config_1.Settings.load();
    vscode_1.workspace.onDidChangeConfiguration((e) => {
        config_1.Settings.onChange(e);
    });
    (0, Language_1.setLanguage)(vscode_1.window.activeTextEditor?.document.fileName);
    configure(context).finally(() => (0, listener_1.default)(vscode_1.window.activeTextEditor));
    // Add listeners
    context.subscriptions.push(
    // Add active text editor listener and run once on start.
    vscode_1.window.onDidChangeActiveTextEditor((e) => {
        console.debug("Active text editor changed");
        (0, Language_1.setLanguage)(vscode_1.window.activeTextEditor?.document.fileName);
        return (0, listener_1.default)(e);
    }), 
    // When the text document is changed, fetch + check dependencies
    vscode_1.workspace.onDidChangeTextDocument((e) => {
        if (e.document.fileName !== vscode_1.window.activeTextEditor?.document.fileName) {
            return;
        }
        console.debug("Text document changed");
        (0, Language_1.setLanguage)(vscode_1.window.activeTextEditor?.document.fileName);
        if (!e.document.isDirty) {
            (0, listener_1.default)(vscode_1.window.activeTextEditor);
        }
    }));
    console.debug("Adding commands");
    context.subscriptions.push(retry_1.retry);
    context.subscriptions.push(replaceVersion_1.replaceVersion);
    context.subscriptions.push(updateAll_1.updateAll);
    context.subscriptions.push((0, generateVulnerabilityReport_1.generateVulnerabilityReport)(context));
    context.subscriptions.push((0, generateCurrentVulnReport_1.generateCurrentVulnReport)(context));
}
function deactivate() {
}
async function configure(context) {
    const lt = new storage_1.ExtensionStorage(context);
    const deviceID = await lt.initDeviceID();
    config_1.Settings.api.deviceID = deviceID;
    config_1.Settings.version = context.extension.packageJSON.version;
    if (lt.isFirstInstall()) {
        console.debug("First install");
        WelcomePanel_1.WelcomePagePanel.render(context);
        await lt.setShownVersion(config_1.Settings.version);
    }
    else if (lt.shouldShowWelcomePage(context.extension.packageJSON.version)) {
        console.debug("Updated version");
        vscode_1.window.withProgress({
            title: "Dependi has been updated to a new version. See the [CHANGELOG!](https://github.com/filllabs/dependi/blob/main/vscode/CHANGELOG.md)",
            cancellable: true,
            location: vscode_1.ProgressLocation.Notification,
        }, async () => {
            await new Promise(async (resolve, reject) => {
                setTimeout(() => {
                    resolve();
                }, 3000);
            });
        });
        await lt.setShownVersion(context.extension.packageJSON.version);
    }
}
//# sourceMappingURL=extension.js.map