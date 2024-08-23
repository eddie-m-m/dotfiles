"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = decorate;
const decoration_1 = __importDefault(require("./decoration"));
const pref_1 = require("./pref");
const status_bar_1 = require("./status-bar");
var previousPref;
/**
 *
 * @param editor Takes crate info and editor. Decorates the editor.
 * @param dependencies
 */
function decorate(editor, dependencies, lang) {
    // vulns (params)
    const pref = (0, pref_1.loadPref)();
    const errors = [];
    const filtered = dependencies.filter((dep) => {
        if (dep && !dep.error && dep.versions && dep.versions.length) {
            return dep;
        }
        else if (!dep.error) {
            dep.error = dep.item.key + ": " + "No versions found";
        }
        errors.push(`${dep.error}`);
        return dep;
    });
    const compOptions = [];
    const inCompOptions = [];
    const errOptions = [];
    for (let i = filtered.length - 1; i > -1; i--) {
        const dependency = filtered[i];
        const vuln = dependencies[i];
        try {
            let deco = (0, decoration_1.default)(editor, dependency.item, dependency.versions || [], JSON.parse(JSON.stringify(pref)), lang, dependency.vulns, dependency.error);
            if (deco) {
                switch (deco[1]) {
                    case "COMP":
                        compOptions.push(deco[0]);
                        break;
                    case "PATCH":
                        compOptions.push(deco[0]);
                        break;
                    case "INCOMP":
                        inCompOptions.push(deco[0]);
                        break;
                    case "ERROR":
                        errOptions.push(deco[0]);
                        break;
                }
            }
        }
        catch (e) {
            console.error(e);
            errors.push(`Failed to build build decorator (${dependency.item.value})`);
        }
    }
    // dispose old decorations
    if (previousPref) {
        previousPref.compatibleType.dispose();
        previousPref.incompatibleType.dispose();
        previousPref.errorType.dispose();
    }
    editor.setDecorations(pref.compatibleType, compOptions);
    editor.setDecorations(pref.incompatibleType, inCompOptions);
    editor.setDecorations(pref.errorType, errOptions);
    previousPref = pref;
    if (errors.length) {
        status_bar_1.StatusBar.setText("Error", `Completed with errors ${errors.join("\n")}`, true);
    }
    else {
        status_bar_1.StatusBar.setText("Info");
    }
}
//# sourceMappingURL=decorator.js.map