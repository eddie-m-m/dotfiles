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
exports.isSparseCompatible = isSparseCompatible;
const https = __importStar(require("https"));
const node_cache_1 = __importDefault(require("node-cache"));
const utils_1 = require("../utils");
const cache = new node_cache_1.default({ stdTTL: 60 * 10 });
const versions = (name, indexServerURL) => {
    // clean dirty names
    name = name.replace(/"/g, "");
    return new Promise(function (resolve, reject) {
        const cached = cache.get(name);
        if (cached) {
            resolve(cached);
            return;
        }
        // compute sparse index prefix
        let prefix;
        const lower_name = name.toLowerCase();
        if (lower_name.length <= 2) {
            prefix = lower_name.length.toFixed(0);
        }
        else if (lower_name.length == 3) {
            prefix = "3/" + lower_name.substring(0, 1);
        }
        else {
            prefix = lower_name.substring(0, 2) + "/" + lower_name.substring(2, 4);
        }
        const url = `${indexServerURL}/${prefix}/${lower_name}`;
        const options = (0, utils_1.getReqOptions)(url);
        var req = https.get(options, function (res) {
            // reject on bad status
            if (!res.statusCode) {
                reject(new Error(`statusCode=${res.statusCode}: ${url}`));
                return;
            }
            if (res.statusCode < 200 || res.statusCode >= 300) {
                return reject(new Error(`statusCode=${res.statusCode}: ${url}`));
            }
            // cumulate data
            var crate_metadatas;
            var body = [];
            res.on('data', function (chunk) {
                body.push(chunk);
            });
            // resolve on end
            res.on('end', function () {
                try {
                    var body_lines = Buffer.concat(body).toString().split('\n').filter(n => n);
                    var body_array = [];
                    for (var line of body_lines) {
                        body_array.push(JSON.parse(line));
                    }
                    crate_metadatas = {
                        name: name,
                        versions: body_array.filter((e) => e.yanked === false).map((e) => e.vers),
                        features: Object.keys(body_array.at(-1).features).filter(feature => feature !== "default")
                    };
                    cache.set(name, crate_metadatas);
                }
                catch (e) {
                    reject(e);
                }
                resolve(crate_metadatas);
            });
        });
        // reject on request error
        req.on('error', function (err) {
            // This is not a "Second reject", just a different sort of failure
            reject(err);
        });
        // IMPORTANT
        req.end();
    });
};
exports.versions = versions;
// Check if `config.json` exists at root of `indexServerURL`
async function isSparseCompatible(indexServerURL) {
    return new Promise(function (resolve, reject) {
        const cached = cache.get(indexServerURL);
        if (cached) {
            resolve(cached);
            return;
        }
        var req = https.get(`${indexServerURL}/config.json`, (res) => {
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300 && res.headers['content-type'] === "application/json") {
                cache.set(indexServerURL, true);
                resolve(true);
            }
            else {
                cache.set(indexServerURL, false);
                resolve(false);
            }
        }).on('error', (e) => {
            reject(e);
        });
        req.end();
    });
}
//# sourceMappingURL=sparse-index-server.js.map