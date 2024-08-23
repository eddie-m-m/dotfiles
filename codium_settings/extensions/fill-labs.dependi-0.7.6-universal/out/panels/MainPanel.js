"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebviewPanel = void 0;
class WebviewPanel {
    constructor(panel, extensionUri) {
        this._disposables = [];
        this._panel = panel;
        this._extensionUri = extensionUri;
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    }
    dispose() {
        this._panel.dispose();
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }
    _getWebviewContent() {
        return "";
    }
}
exports.WebviewPanel = WebviewPanel;
//# sourceMappingURL=MainPanel.js.map