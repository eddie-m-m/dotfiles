"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchedLatestsMap = exports.fetchedLatest = exports.fetchedDepsMap = exports.fetchedDeps = exports.dependencies = exports.JsonListener = void 0;
const config_1 = require("../../config");
const decorator_1 = __importDefault(require("../../ui/decorator"));
const listener_1 = require("./listener");
class JsonListener {
    constructor(fetcher, parser, lang) {
        this.fetcher = fetcher;
        this.parser = parser;
        this.lang = lang;
    }
    async parseAndDecorate(editor) {
        try {
            exports.dependencies = dependencies = this.parser.parse(editor.document);
            if (!fetchedLatest || !fetchedLatestsMap) {
                const latestResult = await this.fetcher.versions(dependencies);
                exports.fetchedLatest = fetchedLatest = latestResult;
                if (config_1.Settings.vulnerability.enabled) {
                    exports.fetchedLatest = fetchedLatest = await this.fetcher.vulns(fetchedLatest);
                }
                (0, decorator_1.default)(editor, fetchedLatest, this.lang);
            }
            ;
            if (!fetchedDeps || !fetchedDepsMap) {
                const versionResults = await this.fetcher.versions(dependencies);
                exports.fetchedDeps = fetchedDeps = versionResults;
                if (config_1.Settings.vulnerability.enabled) {
                    const chunkedArrays = chunkDataArray(fetchedDeps, 1000);
                    const promises = chunkedArrays.map(async (chunk) => {
                        return this.fetcher.vulns(chunk);
                    });
                    // Wait for all promises to resolve
                    const chunkPromise = await Promise.all(promises);
                    exports.fetchedDeps = fetchedDeps = chunkPromise.reduce((acc, curr) => acc.concat(curr), []);
                }
                (0, listener_1.replaceItemList)(fetchedDeps);
                (0, decorator_1.default)(editor, fetchedDeps, this.lang);
            }
        }
        catch (e) {
            console.error(e);
        }
    }
}
exports.JsonListener = JsonListener;
function chunkDataArray(data, chunkSize) {
    const chunkedData = [];
    let currentChunk = [];
    let currentChunkSize = 0;
    data.forEach(obj => {
        const objSize = obj.versions?.length ?? 0;
        if (currentChunkSize + objSize <= chunkSize) {
            currentChunk.push(obj);
            currentChunkSize += objSize;
        }
        else {
            chunkedData.push(currentChunk);
            if (obj.versions && obj.versions.length > chunkSize) {
                obj.versions = obj.versions.slice(0, 1000);
            }
            currentChunk = [obj];
            currentChunkSize = objSize;
        }
    });
    if (currentChunk.length > 0) {
        chunkedData.push(currentChunk);
    }
    return chunkedData;
}
var dependencies;
var fetchedDeps;
var fetchedDepsMap;
var fetchedLatest;
var fetchedLatestsMap;
//# sourceMappingURL=JsonListener.js.map