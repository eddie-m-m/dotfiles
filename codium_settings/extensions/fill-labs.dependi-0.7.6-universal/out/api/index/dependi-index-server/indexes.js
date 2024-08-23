"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Indexes = void 0;
exports.getVersions = getVersions;
const vscode_1 = require("vscode");
const _1 = require(".");
const config_1 = require("../../../config");
const dialogs_1 = require("../../../ui/dialogs");
const errors_1 = require("./errors");
async function getVersions(value, options) {
    const mappedVal = {
        Language: value.Language,
        Packages: value.Packages,
        IgnoreUnstables: value.IgnoreUnstables,
        VulnerabilityCheck: value.VulnerabilityCheck,
        GhsaCheck: value.GhsaCheck,
    };
    return await (0, _1.request)(`v1/indexes`, {
        method: "POST",
        body: JSON.stringify(mappedVal),
        ...options,
    })
        .then((resp) => {
        if (resp.status !== 200) {
            switch ((0, errors_1.getError)(resp.error)) {
                case errors_1.Errors.DLR:
                    (0, dialogs_1.openDeviceLimitDialog)();
                    return [];
                case errors_1.Errors.PAYRQ:
                    (0, dialogs_1.openPaymentRequiredDialog)();
                    return [];
                case errors_1.Errors.UNAUTH:
                    (0, dialogs_1.openSettingsDialog)(config_1.Configs.INDEX_SERVER_API_KEY, "Unauthorized, please check your api key.");
                    return [];
                case errors_1.Errors.IVAK:
                    (0, dialogs_1.openSettingsDialog)(config_1.Configs.INDEX_SERVER_API_KEY, "Invalid api key or api key not found. Please check your api key.");
                    return [];
                case errors_1.Errors.UINA:
                    (0, dialogs_1.openSettingsDialog)(config_1.Configs.INDEX_SERVER_API_KEY, "User is not active. Please check emails from us or visit dependi.io dashboard.");
                default:
                    vscode_1.window.showErrorMessage((0, errors_1.getError)(resp.error));
                    return [];
            }
        }
        const versions = resp.body?.filter((o) => o?.Name);
        const versionsMap = new Map(versions?.map((version) => [version.Name, version]));
        const deps = value.Dependencies.map((dep) => {
            const matchingVersion = versionsMap.get(dep.item.key);
            if (matchingVersion && matchingVersion.Versions) {
                // Update the 'versions' field with VersionsResp's 'Versions'
                dep.versions = matchingVersion.Versions;
                if (matchingVersion.Vulns) {
                    const vulnEntries = Object.entries(matchingVersion.Vulns);
                    dep.vulns = new Map(vulnEntries);
                }
            }
            return dep;
        });
        return deps;
    })
        .catch((err) => {
        console.error("Catch get versions", err);
        return [];
    });
}
exports.Indexes = {
    getVersions,
};
//# sourceMappingURL=indexes.js.map