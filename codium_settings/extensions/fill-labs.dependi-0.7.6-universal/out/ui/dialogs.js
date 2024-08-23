"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openDeviceLimitDialog = openDeviceLimitDialog;
exports.openPaymentRequiredDialog = openPaymentRequiredDialog;
exports.openSettingsDialog = openSettingsDialog;
exports.openUserNotActive = openUserNotActive;
const vscode_1 = require("vscode");
const config_1 = require("../config");
const buttons = {
    settings: "Open settings",
    dashboard: "Go to Dashboard"
};
async function openDialog(message, actions) {
    return vscode_1.window.showErrorMessage(message, ...Object.keys(actions))
        .then(async (value) => {
        await actions[value ?? ""]?.();
    });
}
function openDeviceLimitDialog() {
    openDialog("Device Limit reached. You can edit your api key or visit dependi.io dashboard to manage devices.", {
        [buttons.settings]: () => vscode_1.commands.executeCommand('workbench.action.openSettingsJson', { revealSetting: { key: config_1.DEPENDI + config_1.Configs.INDEX_SERVER_API_KEY, edit: true } }),
        [buttons.dashboard]: () => vscode_1.commands.executeCommand('vscode.open', `${config_1.Settings.api.proPanelURL}/api-key-management`)
    });
}
function openPaymentRequiredDialog() {
    openDialog("Payment required. Please visit dependi.io dashboard to update your payment method.", {
        [buttons.dashboard]: () => vscode_1.commands.executeCommand('vscode.open', `${config_1.Settings.api.proPanelURL}/payments`)
    });
}
function openSettingsDialog(key, message) {
    openDialog(message, {
        "Open settings": () => vscode_1.commands.executeCommand('workbench.action.openSettingsJson', { revealSetting: { key: config_1.DEPENDI + key, edit: true } })
    });
}
function openUserNotActive() {
    openDialog("User is not active. Please check emails from us or visit dependi.io dashboard.", {
        [buttons.settings]: () => vscode_1.commands.executeCommand('workbench.action.openSettingsJson', { revealSetting: { key: config_1.DEPENDI + config_1.Configs.INDEX_SERVER_API_KEY, edit: true } }),
        [buttons.dashboard]: () => vscode_1.commands.executeCommand('vscode.open', `${config_1.Settings.api.proPanelURL}/dashboard`)
    });
}
//# sourceMappingURL=dialogs.js.map