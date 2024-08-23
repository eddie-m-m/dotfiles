"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retry = void 0;
const vscode_1 = require("vscode");
const config_1 = require("../config");
const listener_1 = __importDefault(require("../core/listeners/listener"));
exports.retry = vscode_1.commands.registerTextEditorCommand(config_1.Configs.RETRY, (editor, edit, info) => {
    if (editor) {
        (0, listener_1.default)(editor);
    }
});
//# sourceMappingURL=retry.js.map