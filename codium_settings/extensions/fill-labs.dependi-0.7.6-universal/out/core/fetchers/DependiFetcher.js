"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependiFetcher = void 0;
const indexes_1 = require("../../api/index/dependi-index-server/indexes");
const config_1 = require("../../config");
const compareVersions_1 = __importDefault(require("../../semver/compareVersions"));
const Language_1 = require("../Language");
const PypiParser_1 = require("../parsers/PypiParser");
const fetcher_1 = require("./fetcher");
class DependiFetcher extends fetcher_1.Fetcher {
    async versions(dependencies) {
        const req = {
            Language: Language_1.CurrentLanguage,
            Packages: dependencies.map((d) => d.key),
            Dependencies: dependencies.map((i) => ({ item: i, versions: [i.value] })),
            IgnoreUnstables: this.ignoreUnstable,
            VulnerabilityCheck: config_1.Settings.vulnerability.enabled,
            GhsaCheck: config_1.Settings.vulnerability.ghsa
        };
        if (config_1.Settings.api.deviceID === "") {
            console.error("DeviceID is empty");
        }
        let versions = await indexes_1.Indexes.getVersions(req, {
            headers: {
                Authorization: config_1.Settings.api.key,
                "X-Device-ID": config_1.Settings.api.deviceID,
                "Content-Type": "application/json",
            },
        });
        if (Language_1.CurrentLanguage === Language_1.Language.Python) {
            const mappedVersions = versions.map((v) => {
                return this.mapVersions(v);
            });
            versions = mappedVersions;
        }
        return Promise.all(versions);
    }
    async vulns(dependencies) {
        throw new Error("Method not implemented.");
    }
    checkPreRelease(version) {
        throw new Error("Method not implemented.");
    }
    mapVersions(dep, item) {
        const versions = dep
            .versions.filter((i) => i !== "" && i !== undefined)
            .sort(compareVersions_1.default)
            .reverse();
        if (item) {
            const constrains = (0, PypiParser_1.splitByComma)(item.value ?? "");
            const currVersion = (0, PypiParser_1.possibleLatestVersion)(constrains, versions);
            item.value = currVersion ? currVersion : item.value;
            return {
                item,
                versions,
            };
        }
        const constrains = (0, PypiParser_1.splitByComma)(dep.item.value ?? "");
        const currVersion = (0, PypiParser_1.possibleLatestVersion)(constrains, versions);
        dep.item.value = currVersion ? currVersion : dep.item.value;
        dep.versions = versions;
        return dep;
    }
}
exports.DependiFetcher = DependiFetcher;
//# sourceMappingURL=DependiFetcher.js.map