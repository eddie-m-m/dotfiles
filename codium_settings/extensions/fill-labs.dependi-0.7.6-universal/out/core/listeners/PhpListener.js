"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchedLatestsMap = exports.fetchedLatest = exports.fetchedDepsMap = exports.fetchedDeps = exports.dependencies = exports.PhpListener = void 0;
const Language_1 = require("../Language");
const JsonListener_1 = require("./JsonListener");
class PhpListener extends JsonListener_1.JsonListener {
    constructor(fetcher, parser) {
        super(fetcher, parser, Language_1.Language.PHP);
        this.fetcher = fetcher;
        this.parser = parser;
    }
}
exports.PhpListener = PhpListener;
var dependencies;
var fetchedDeps;
var fetchedDepsMap;
var fetchedLatest;
var fetchedLatestsMap;
//# sourceMappingURL=PhpListener.js.map