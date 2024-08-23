"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.channel = void 0;
const vscode = require("vscode");
// log to our output channel
function log(message) {
    if (!exports.channel) {
        exports.channel = vscode.window.createOutputChannel('Rubocop');
    }
    // log to channel with timestamp
    const now = new Date().toISOString();
    exports.channel.appendLine(`[${now}] ${message}`);
}
exports.log = log;
//# sourceMappingURL=channel.js.map