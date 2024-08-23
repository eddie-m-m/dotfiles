"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentLanguageConfig = exports.CurrentLanguage = exports.Language = void 0;
exports.setLanguage = setLanguage;
const path_1 = __importDefault(require("path"));
var Language;
(function (Language) {
    Language[Language["None"] = 0] = "None";
    Language[Language["Rust"] = 1] = "Rust";
    Language[Language["Golang"] = 2] = "Golang";
    Language[Language["JS"] = 3] = "JS";
    Language[Language["Python"] = 4] = "Python";
    Language[Language["PHP"] = 5] = "PHP";
})(Language || (exports.Language = Language = {}));
exports.CurrentLanguage = Language.None;
exports.CurrentLanguageConfig = "";
function setLanguage(file) {
    if (!file) {
        exports.CurrentLanguage = Language.None;
        return;
    }
    const filename = path_1.default.basename(file);
    switch (filename.toLowerCase()) {
        case "cargo.toml":
            exports.CurrentLanguage = Language.Rust;
            exports.CurrentLanguageConfig = "rust";
            return Language.Rust;
        case "go.mod":
            exports.CurrentLanguage = Language.Golang;
            exports.CurrentLanguageConfig = "go";
            return Language.Golang;
        case "package.json":
            exports.CurrentLanguage = Language.JS;
            exports.CurrentLanguageConfig = "npm";
            return Language.JS;
        case "requirements.txt":
            exports.CurrentLanguage = Language.Python;
            exports.CurrentLanguageConfig = "python";
            return Language.Python;
        case "composer.json":
            exports.CurrentLanguage = Language.PHP;
            exports.CurrentLanguageConfig = "php";
            return Language.PHP;
        case "pyproject.toml":
            exports.CurrentLanguage = Language.Python;
            exports.CurrentLanguageConfig = "python";
            return Language.Python;
    }
}
;
//# sourceMappingURL=Language.js.map