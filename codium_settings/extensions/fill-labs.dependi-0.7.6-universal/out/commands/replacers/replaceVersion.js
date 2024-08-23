"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceVersion = void 0;
const vscode_1 = require("vscode");
const replace_1 = require("./replace");
const config_1 = require("../../config");
/**
 * Replace the version of the dependency at the given range.
 * @param editor The active text editor.
 * @param edit The text editor edit.
 * @param info The replace item.
 */
exports.replaceVersion = vscode_1.commands.registerTextEditorCommand(config_1.Configs.REPLACE_VERSIONS, (editor, edit, info) => {
    if (editor && info && !replace_1.status.inProgress) {
        replace_1.status.inProgress = true;
        console.debug("Replacing", info.value, "at", info.range);
        const range = new vscode_1.Range(info.range.start.line, info.range.start.character, info.range.end.line, info.range.end.character);
        edit.replace(range, info.value);
        replace_1.status.inProgress = false;
    }
    vscode_1.workspace.save(editor.document.uri).then((uri) => {
        if (uri)
            console.debug("Saved", uri);
        else
            console.error("Failed to save", uri);
    });
});
//# sourceMappingURL=replaceVersion.js.map