"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkVersion = checkVersion;
const semver_1 = require("semver");
const config_1 = require("../config");
const Language_1 = require("../core/Language");
function checkVersion(version = "0.0.0", versions) {
    let v = version;
    let prefix = v.charCodeAt(0);
    if (prefix > 47 && prefix < 58)
        v = "^" + v;
    const max = versions[0];
    if ((0, semver_1.maxSatisfying)(versions, v) === null) {
        if ((0, semver_1.valid)(v) === null) {
            return [false, false, null];
        }
        // TODO: ask this test with kaan
        const minV = (0, semver_1.minVersion)(v)?.toString() ?? '0.0.0';
        if ((0, semver_1.gt)(minV, max)) {
            return [true, true, v];
        }
    }
    // if check patch is true, check if the patch version is the same or higher than the current version
    let shouldPatchBeChecked = false;
    switch (Language_1.CurrentLanguage) {
        case Language_1.Language.Rust:
            shouldPatchBeChecked = config_1.Settings.rust.informPatchUpdates;
            break;
        case Language_1.Language.JS:
            shouldPatchBeChecked = config_1.Settings.npm.informPatchUpdates;
            break;
        case Language_1.Language.PHP:
            shouldPatchBeChecked = config_1.Settings.php.informPatchUpdates;
            break;
        case Language_1.Language.Golang:
            shouldPatchBeChecked = config_1.Settings.go.informPatchUpdates;
            break;
        case Language_1.Language.Python:
            shouldPatchBeChecked = config_1.Settings.python.informPatchUpdates;
            break;
    }
    const pathUpdated = shouldPatchBeChecked ? (0, semver_1.compare)(max, (0, semver_1.minVersion)(v) ?? '0.0.0') === 1 : false;
    return [(0, semver_1.satisfies)(max, v), pathUpdated, (0, semver_1.maxSatisfying)(versions, v)];
}
//# sourceMappingURL=semverUtils.js.map