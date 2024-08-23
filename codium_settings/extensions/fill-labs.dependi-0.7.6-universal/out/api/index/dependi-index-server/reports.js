"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLangIdFromName = exports.Language = void 0;
exports.getVulnReport = getVulnReport;
exports.getCurrentVulnReport = getCurrentVulnReport;
exports.getReportPDF = getReportPDF;
const _1 = require(".");
const config_1 = require("../../../config");
var Language;
(function (Language) {
    Language[Language["None"] = 0] = "None";
    Language[Language["Rust"] = 1] = "Rust";
    Language[Language["Golang"] = 2] = "Golang";
    Language[Language["JS"] = 3] = "JS";
    Language[Language["Python"] = 4] = "Python";
    Language[Language["PHP"] = 5] = "PHP";
})(Language || (exports.Language = Language = {}));
const LanguageArray = [
    { ID: Language.Rust, Name: "Cargo.toml" },
    { ID: Language.Golang, Name: "go.mod" },
    { ID: Language.JS, Name: "package.json" },
    { ID: Language.PHP, Name: "composer.json" },
    { ID: Language.Python, Name: "requirements.txt" },
];
const getLangIdFromName = (name) => LanguageArray.find((lang) => lang.Name === name)?.ID ?? Language.None;
exports.getLangIdFromName = getLangIdFromName;
async function getVulnReport(req, options) {
    const response = await (0, _1.request)(`v1/reports/vulnerability`, {
        method: "POST",
        headers: {
            Authorization: config_1.Settings.api.key,
            "X-Device-ID": config_1.Settings.api.deviceID,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
        ...options,
    });
    return response;
}
async function getCurrentVulnReport(req, options) {
    const response = await (0, _1.request)(`v1/reports/vulnerability/current`, {
        method: "POST",
        headers: {
            Authorization: config_1.Settings.api.key,
            "X-Device-ID": config_1.Settings.api.deviceID,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
        ...options,
    });
    return response;
}
async function getReportPDF(req, options) {
    return await (0, _1.request)(`v1/reports/pdf`, {
        method: "POST",
        body: JSON.stringify(req),
        headers: {
            Authorization: config_1.Settings.api.key,
            "X-Device-ID": config_1.Settings.api.deviceID,
            "Content-Type": "application/json",
        },
        ...options,
    });
}
//# sourceMappingURL=reports.js.map