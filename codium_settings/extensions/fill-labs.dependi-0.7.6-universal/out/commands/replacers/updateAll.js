"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAll = void 0;
/**
 * Commands related to TOML files.
 */
const vscode_1 = require("vscode");
const replace_1 = require("./replace");
const config_1 = require("../../config");
exports.updateAll = vscode_1.commands.registerTextEditorCommand(config_1.Configs.UPDATE_ALL, (editor, edit) => {
    if (editor &&
        !replace_1.status.inProgress &&
        replace_1.status.replaceItems &&
        replace_1.status.replaceItems.length > 0) {
        replace_1.status.inProgress = true;
        console.debug("Replacing All");
        for (let i = replace_1.status.replaceItems.length - 1; i > -1; i--) {
            const rItem = replace_1.status.replaceItems[i];
            edit.replace(new vscode_1.Range(rItem.range.start.line, rItem.range.start.character, rItem.range.end.line, rItem.range.end.character), rItem.value);
        }
        replace_1.status.inProgress = false;
        vscode_1.workspace.save(editor.document.uri).then((uri) => {
            if (uri)
                console.debug("Saved", uri);
            else
                console.error("Failed to save", uri);
        });
    }
});
//# sourceMappingURL=updateAll.js.map