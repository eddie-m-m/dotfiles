"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadPref = loadPref;
const vscode_1 = require("vscode");
const config_1 = require("../config");
function loadPref() {
    const compText = config_1.Settings.decorator.compatible.template;
    const compCss = { ...config_1.Settings.decorator.compatible.css };
    const patchText = config_1.Settings.decorator.patchUpdate.template;
    const patchCss = { ...config_1.Settings.decorator.patchUpdate.css };
    const incompText = config_1.Settings.decorator.incompatible.template;
    const incompCss = { ...config_1.Settings.decorator.incompatible.css };
    const errorText = config_1.Settings.decorator.error.template;
    const errorCss = { ...config_1.Settings.decorator.error.css };
    const vulnText = config_1.Settings.decorator.vulnerability.template;
    const position = config_1.Settings.decorator.position;
    initializeCSS(compCss, position, compText);
    initializeCSS(incompCss, position, incompText);
    initializeCSS(errorCss, position, errorText);
    return {
        compatibleType: createType(compCss),
        patchUpdateType: createType(patchCss),
        incompatibleType: createType(incompCss),
        errorType: createType(errorCss),
        compatibleText: compText,
        patchUpdateText: patchText,
        incompatibleText: incompText,
        errorText,
        vulnText: vulnText,
        position,
    };
}
function initializeCSS(css, position, text) {
    if (css[position] == undefined || css[position] == null) {
        css[position] = {
            margin: "0.5em"
        };
    }
    css[position].contentText = text;
}
function createType(options) {
    return vscode_1.window.createTextEditorDecorationType(options);
}
;
//# sourceMappingURL=pref.js.map