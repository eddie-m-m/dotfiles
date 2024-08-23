"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.winHelper = exports.parserInvoker = void 0;
exports.handleReportError = handleReportError;
const errors_1 = require("../../api/index/dependi-index-server/errors");
const CargoTomlParser_1 = require("../../core/parsers/CargoTomlParser");
const GoModParser_1 = require("../../core/parsers/GoModParser");
const NpmParser_1 = require("../../core/parsers/NpmParser");
const PhpParser_1 = require("../../core/parsers/PhpParser");
const PypiParser_1 = require("../../core/parsers/PypiParser");
const os_1 = __importDefault(require("os"));
const dialogs_1 = require("../../ui/dialogs");
const config_1 = require("../../config");
const vscode_1 = require("vscode");
const parserInvoker = (language) => {
    switch (language) {
        case "Cargo.toml":
            return new CargoTomlParser_1.CargoTomlParser();
        case "go.mod":
            return new GoModParser_1.GoModParser();
        case "package.json":
            return new NpmParser_1.NpmParser();
        case "composer.json":
            return new PhpParser_1.PhpParser();
        case "requirements.txt":
            return new PypiParser_1.PypiParser();
        default:
            throw Error("Language not supported");
    }
};
exports.parserInvoker = parserInvoker;
const winHelper = (path) => {
    if (os_1.default.platform() !== "win32") {
        return path;
    }
    let newPath = path.slice(1);
    return newPath = newPath.replace(/\\/g, "/");
};
exports.winHelper = winHelper;
function handleReportError(reportResp) {
    switch ((0, errors_1.getError)(reportResp.error)) {
        case errors_1.Errors.DLR:
            (0, dialogs_1.openDeviceLimitDialog)();
            break;
        case errors_1.Errors.PAYRQ:
            (0, dialogs_1.openPaymentRequiredDialog)();
            break;
        case errors_1.Errors.UNAUTH:
            (0, dialogs_1.openSettingsDialog)(config_1.Configs.INDEX_SERVER_API_KEY, "Unauthorized, please check your api key.");
            break;
        case errors_1.Errors.IVAK:
            (0, dialogs_1.openSettingsDialog)(config_1.Configs.INDEX_SERVER_API_KEY, "Invalid api key or api key not found. Please check your api key.");
            break;
        case errors_1.Errors.UINA:
            (0, dialogs_1.openSettingsDialog)(config_1.Configs.INDEX_SERVER_API_KEY, "User is not active. Please check emails from us or visit dependi.io dashboard.");
            break;
        default:
            vscode_1.window.showErrorMessage((0, errors_1.getError)(reportResp.error));
    }
}
//# sourceMappingURL=utils.js.map