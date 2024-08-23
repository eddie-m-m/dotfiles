"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusBar = void 0;
/**
 * A utility to manage Status Bar operations.
 */
const vscode_1 = require("vscode");
const config_1 = require("../config");
exports.StatusBar = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right, -1000);
exports.StatusBar.setText = (t, text, noDialog = false) => {
    switch (t) {
        case "Error":
            exports.StatusBar.color = "statusBarItem.errorForeground";
            exports.StatusBar.text = "$(error) Dependi";
            if (noDialog) {
                exports.StatusBar.tooltip = text || "Error";
                return;
            }
            else {
                exports.StatusBar.tooltip = "";
                vscode_1.window.showErrorMessage(text || "Error");
                return;
            }
        case "Warning":
            exports.StatusBar.text = "$(warning) Dependi";
            exports.StatusBar.color = "statusBarItem.warningForeground";
            break;
        case "Info":
            exports.StatusBar.color = "statusBarItem.foreground";
            exports.StatusBar.text = "$(check-all) Dependi";
            break;
        case "Loading":
            exports.StatusBar.color = "statusBarItem.activeForeground";
            exports.StatusBar.text = "$(sync~spin) Dependi";
    }
    if (text) {
        vscode_1.window.setStatusBarMessage(`Dependi: ${text}`, 2000);
    }
    exports.StatusBar.tooltip = text;
    exports.StatusBar.command = config_1.Configs.RETRY;
};
exports.StatusBar.fetching = (indexServerURL) => {
    exports.StatusBar.color = "statusBarItem.activeForeground";
    exports.StatusBar.text = "$(sync~spin) Dependi";
    exports.StatusBar.tooltip = "👀 Fetching " + indexServerURL.replace(/^https?:\/\//, '');
    exports.StatusBar.command = config_1.Configs.RETRY;
};
exports.default = {
    StatusBar: exports.StatusBar,
};
//# sourceMappingURL=status-bar.js.map