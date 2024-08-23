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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CratesFetcher = void 0;
const API = __importStar(require("../../api/index/sparse-index-server"));
const vulnerability_service_1 = require("../../api/osv/vulnerability-service");
const config_1 = require("../../config");
const compareVersions_1 = __importDefault(require("../../semver/compareVersions"));
const status_bar_1 = require("../../ui/status-bar");
const fetcher_1 = require("./fetcher");
class CratesFetcher extends fetcher_1.Fetcher {
    async versions(dependencies) {
        let transformer = this.transformServerResponse(API.versions, this.URL);
        const responses = dependencies.map(transformer);
        return Promise.all(responses);
    }
    transformServerResponse(versions, indexServerURL) {
        const base = this;
        return function (item) {
            return versions(item.key, indexServerURL)
                .then((crate) => {
                const versions = crate.versions
                    .filter((i) => i !== "" && i !== undefined && !base.checkPreRelease(i))
                    .sort(compareVersions_1.default)
                    .reverse();
                return {
                    item,
                    versions,
                };
            })
                .catch((error) => {
                console.error(error);
                return {
                    item,
                    error: item.key + ": " + error,
                };
            });
        };
    }
    async vulns(dependencies) {
        // Set status bar fetching vulnerabilities
        status_bar_1.StatusBar.setText("Loading", "👀 Fetching vulnerabilities");
        const packageVulns = await (0, vulnerability_service_1.queryMultiplePackageVulns)(dependencies, "crates.io");
        return packageVulns;
    }
    checkPreRelease(version) {
        if (!config_1.Settings.rust.ignoreUnstable)
            return false;
        return (version.indexOf("-alpha") !== -1 ||
            version.indexOf("-beta") !== -1 ||
            version.indexOf("-rc") !== -1 ||
            version.indexOf("-SNAPSHOT") !== -1 ||
            version.indexOf("-dev") !== -1 ||
            version.indexOf("-preview") !== -1 ||
            version.indexOf("-experimental") !== -1 ||
            version.indexOf("-canary") !== -1 ||
            version.indexOf("-pre") !== -1);
    }
}
exports.CratesFetcher = CratesFetcher;
//# sourceMappingURL=CratesFetcher.js.map