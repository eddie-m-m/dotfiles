"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchedVulns = exports.fetchedDepsMap = exports.fetchedDeps = exports.dependencies = exports.DependiListener = void 0;
const decorator_1 = __importDefault(require("../../ui/decorator"));
const Language_1 = require("../Language");
const listener_1 = require("./listener");
class DependiListener {
    constructor(fetcher, parser) {
        this.fetcher = fetcher;
        this.parser = parser;
    }
    async parseAndDecorate(editor) {
        try {
            exports.dependencies = dependencies = this.parser.parse(editor.document);
            if (!fetchedDeps || !fetchedDepsMap) {
                // parallel fetch versions
                // create initial fetchedDeps from dependencies
                exports.fetchedDeps = fetchedDeps = dependencies.map((i) => ({ item: i, versions: [i.value] }));
                const versionResults = await this.fetcher.versions(dependencies);
                exports.fetchedDeps = fetchedDeps = versionResults;
                (0, listener_1.replaceItemList)(fetchedDeps);
                (0, decorator_1.default)(editor, fetchedDeps, Language_1.CurrentLanguage);
            }
        }
        catch (e) {
            console.error(e);
        }
    }
}
exports.DependiListener = DependiListener;
var dependencies;
var fetchedDeps;
var fetchedVulns;
var fetchedDepsMap;
//# sourceMappingURL=DependiListener.js.map