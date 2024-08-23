"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchedVulns = exports.fetchedDepsMap = exports.fetchedDeps = exports.dependencies = exports.CargoTomlListener = void 0;
const config_1 = require("../../config");
const decorator_1 = __importDefault(require("../../ui/decorator"));
const Language_1 = require("../Language");
const listener_1 = require("./listener");
class CargoTomlListener {
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
                const promises = [];
                const versionFetchPromise = this.fetcher.versions(dependencies);
                promises.push(versionFetchPromise);
                // fetch current vulnerabilities depends on check parameter.
                let fetchVulnPromise;
                if (config_1.Settings.vulnerability.enabled) {
                    fetchVulnPromise = this.fetcher.vulns(fetchedDeps);
                    promises.push(fetchVulnPromise);
                }
                // versions and vulnerabilities of current version.
                const [versionResults, vulnResults] = await Promise.all(promises);
                // merge versionResults  with vulnResults set vulns
                exports.fetchedDeps = fetchedDeps = versionResults;
                if (vulnResults) {
                    fetchedDeps.forEach((dep, i) => {
                        dep.vulns = vulnResults[i].vulns;
                    });
                }
                (0, listener_1.replaceItemList)(fetchedDeps);
                // parallel fetch vulns for current versions
                (0, decorator_1.default)(editor, fetchedDeps, Language_1.Language.Rust);
                // fetch all vulnerabilities since current version to latest version.
                if (config_1.Settings.vulnerability.enabled) {
                    const vulnData = await this.fetcher.vulns(fetchedDeps);
                    exports.fetchedVulns = fetchedVulns = await vulnData;
                    (0, decorator_1.default)(editor, vulnData, Language_1.Language.Rust);
                }
            }
        }
        catch (e) {
            console.error(e);
        }
    }
}
exports.CargoTomlListener = CargoTomlListener;
var dependencies;
var fetchedDeps;
var fetchedVulns;
var fetchedDepsMap;
//# sourceMappingURL=CargoTomlListener.js.map