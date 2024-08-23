"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchedLatestsMap = exports.fetchedLatest = exports.fetchedDepsMap = exports.fetchedDeps = exports.dependencies = exports.NpmListener = void 0;
const Language_1 = require("../Language");
const JsonListener_1 = require("./JsonListener");
class NpmListener extends JsonListener_1.JsonListener {
    constructor(fetcher, parser) {
        super(fetcher, parser, Language_1.Language.JS);
        this.fetcher = fetcher;
        this.parser = parser;
    }
}
exports.NpmListener = NpmListener;
var dependencies;
var fetchedDeps;
var fetchedDepsMap;
var fetchedLatest;
var fetchedLatestsMap;
//# sourceMappingURL=NpmListener.js.map