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
const utils_1 = require("../utils");
const cache = new node_cache_1.default({ stdTTL: 60 * 10 });
const versions = (name, indexServerURL) => {
    return new Promise(function (resolve, reject) {
        const cached = cache.get(name);
        if (cached) {
            resolve(cached);
            return;
        }
        const lower_name = name.toLowerCase();
        const url = `${indexServerURL}/${lower_name}/@v/list`;
        const options = (0, utils_1.getReqOptions)(url);
        var req = https.get(options, function (res) {
            // reject on bad status
            if (!res.statusCode) {
                reject(new Error(`statusCode=${res.statusCode}: ${options.host}`));
                return;
            }
            if (res.statusCode < 200 || res.statusCode >= 300) {
                return reject(new Error(`statusCode=${res.statusCode}: ${url}`));
            }
            // cumulate data
            var crate_metadatas;
            let body = [];
            res.on('data', function (chunk) {
                body = chunk.toString('utf8').split('\n');
            });
            // resolve on end
            res.on('end', function () {
                try {
                    crate_metadatas = {
                        name: name,
                        versions: body,
                        features: [] // proxy site does not provide any features data for versions.
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
//# sourceMappingURL=go-proxy-server.js.map