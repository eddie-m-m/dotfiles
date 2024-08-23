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
exports.versions = void 0;
const https = __importStar(require("https"));
const node_cache_1 = __importDefault(require("node-cache"));
const config_1 = require("../../config");
const utils_1 = require("../utils");
const cache = new node_cache_1.default({ stdTTL: 60 * 10 });
const versions = (name, indexServerURL, currentVersion) => {
    return new Promise(function (resolve, reject) {
        const cacheName = currentVersion ? name + "-latest" : name;
        const cached = cache.get(cacheName);
        if (cached) {
            resolve(cached);
            return;
        }
        const url = `${indexServerURL}/${currentVersion ? `-/package/${name}/dist-tags` : `${name}`}`;
        const options = (0, utils_1.getReqOptions)(url);
        if (!currentVersion) {
            options.headers = {
                Accept: "application/vnd.npm.install-v1+json",
            };
        }
        var req = https.get(options, function (res) {
            // reject on bad status
            if (!res.statusCode) {
                reject(new Error(`statusCode=${res.statusCode}: ${options.hostname}${options.path}`));
                return;
            }
            if (res.statusCode < 200 || res.statusCode >= 300) {
                return reject(new Error(`statusCode=${res.statusCode}: ${options.hostname}${options.path}`));
            }
            // cumulate data
            var crate_metadatas;
            let data = "";
            res.on("data", (chunk) => {
                data += chunk;
            });
            res.on("end", () => {
                try {
                    const response = JSON.parse(data);
                    let versions = [];
                    versions = currentVersion
                        ? setLatestVersion(response, currentVersion)
                        : setVersions(response, versions);
                    crate_metadatas = {
                        name: name,
                        versions: versions,
                        features: [],
                    };
                    cache.set(cacheName, crate_metadatas);
                }
                catch (error) {
                    console.error("Error parsing response:", error);
                    reject(error);
                }
                resolve(crate_metadatas);
            });
        });
        // reject on request error
        req.on("error", function (err) {
            // This is not a "Second reject", just a different sort of failure
            reject(err);
        });
        // IMPORTANT
        req.end();
    });
};
exports.versions = versions;
const setVersions = (response, versions) => {
    if (response.versions) {
        const versionData = Object.entries(response.versions);
        if (versionData.length) {
            versionData.forEach(([key, value]) => {
                if (!value.deprecated &&
                    (!config_1.Settings.npm.ignoreUnstable || !key.includes("-"))) {
                    versions.push(key);
                }
            });
        }
    }
    return versions;
};
const setLatestVersion = (response, currentVersion) => {
    return currentVersion === response.latest
        ? [currentVersion]
        : [currentVersion, response.latest];
};
//# sourceMappingURL=npm-index-server.js.map