"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WelcomePagePanel = void 0;
const vscode = __importStar(require("vscode"));
const config_1 = require("../config");
const welcome_page_1 = require("../webviews/welcome-page");
const MainPanel_1 = require("./MainPanel");
class WelcomePagePanel extends MainPanel_1.WebviewPanel {
    constructor(panel, extensionUri, context, version) {
        super(panel, extensionUri);
        this.context = context;
        this._panel.webview.html = this.getWebviewContent(version);
    }
    getWebviewContent(version) {
        const welcomePageHtml = this._getWelcomePageHtml(version);
        return welcomePageHtml;
    }
    static render(context) {
        const panel = vscode.window.createWebviewPanel("welcomeDependi", "Welcome to Dependi", vscode.ViewColumn.One, {});
        const welcomePagePanel = new WelcomePagePanel(panel, context.extensionUri, context, config_1.Settings.version);
    }
    _getWelcomePageHtml(version) {
        return (0, welcome_page_1.getWelcomePage)(this._panel.webview, this._extensionUri, version);
    }
}
exports.WelcomePagePanel = WelcomePagePanel;
//# sourceMappingURL=WelcomePanel.js.map