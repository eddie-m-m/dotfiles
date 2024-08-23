"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = listener;
exports.replaceItemList = replaceItemList;
const replace_1 = require("../../commands/replacers/replace");
const config_1 = require("../../config");
const status_bar_1 = require("../../ui/status-bar");
const Language_1 = require("../Language");
const CratesFetcher_1 = require("../fetchers/CratesFetcher");
const DependiFetcher_1 = require("../fetchers/DependiFetcher");
const GoProxyFetcher_1 = require("../fetchers/GoProxyFetcher");
const NpmFetcher_1 = require("../fetchers/NpmFetcher");
const PhpFetcher_1 = require("../fetchers/PhpFetcher");
const PypiFetcher_1 = require("../fetchers/PypiFetcher");
const CargoTomlParser_1 = require("../parsers/CargoTomlParser");
const GoModParser_1 = require("../parsers/GoModParser");
const NpmParser_1 = require("../parsers/NpmParser");
const PhpParser_1 = require("../parsers/PhpParser");
const PypiParser_1 = require("../parsers/PypiParser");
const CargoTomlListener_1 = require("./CargoTomlListener");
const DependiListener_1 = require("./DependiListener");
const GoModListener_1 = require("./GoModListener");
const NpmListener_1 = require("./NpmListener");
const PhpListener_1 = require("./PhpListener");
const PypiListener_1 = require("./PypiListener");
const path_1 = __importDefault(require("path"));
const PyProjectParser_1 = require("../parsers/PyProjectParser");
async function listener(editor) {
    if (editor) {
        let listener = undefined;
        let ignoreUnstablesKey = "";
        switch (Language_1.CurrentLanguage) {
            case Language_1.Language.Rust:
                if (!config_1.Settings.rust.enabled)
                    return;
                ignoreUnstablesKey = config_1.Configs.RUST_IGNORE_UNSTABLES;
                listener = new CargoTomlListener_1.CargoTomlListener(new CratesFetcher_1.CratesFetcher(config_1.Settings.rust.index, ignoreUnstablesKey, config_1.Configs.RUST_INDEX_SERVER_URL), new CargoTomlParser_1.CargoTomlParser());
                break;
            case Language_1.Language.Golang:
                if (!config_1.Settings.go.enabled)
                    return;
                ignoreUnstablesKey = config_1.Configs.GO_IGNORE_UNSTABLES;
                listener = new GoModListener_1.GoModListener(new GoProxyFetcher_1.GoProxyFetcher(config_1.Settings.go.index, ignoreUnstablesKey, config_1.Configs.GO_INDEX_SERVER_URL), new GoModParser_1.GoModParser());
                break;
            case Language_1.Language.JS:
                if (!config_1.Settings.npm.enabled)
                    return;
                ignoreUnstablesKey = config_1.Configs.NPM_IGNORE_UNSTABLES;
                listener = new NpmListener_1.NpmListener(new NpmFetcher_1.NpmFetcher(config_1.Settings.npm.index, ignoreUnstablesKey, config_1.Configs.NPM_INDEX_SERVER_URL), new NpmParser_1.NpmParser());
                break;
            case Language_1.Language.PHP:
                if (!config_1.Settings.php.enabled)
                    return;
                ignoreUnstablesKey = config_1.Configs.PHP_IGNORE_UNSTABLES;
                listener = new PhpListener_1.PhpListener(new PhpFetcher_1.PhpFetcher(config_1.Settings.php.index, ignoreUnstablesKey, config_1.Configs.PHP_INDEX_SERVER_URL), new PhpParser_1.PhpParser());
                break;
            case Language_1.Language.Python:
                if (!config_1.Settings.python.enabled)
                    return;
                ignoreUnstablesKey = config_1.Configs.PYTHON_IGNORE_UNSTABLES;
                const parser = path_1.default.basename(editor.document.fileName) === "pyproject.toml" ? new PyProjectParser_1.PyProjectParser() : new PypiParser_1.PypiParser();
                listener = new PypiListener_1.PypiListener(new PypiFetcher_1.PypiFetcher(config_1.Settings.python.index, ignoreUnstablesKey, config_1.Configs.PYTHON_INDEX_SERVER_URL), parser);
        }
        if (listener !== undefined) {
            if (config_1.Settings.api.key !== "" && config_1.Settings.api.url !== "") {
                listener = new DependiListener_1.DependiListener(new DependiFetcher_1.DependiFetcher(config_1.Settings.api.url, ignoreUnstablesKey, config_1.Configs.INDEX_SERVER_URL), listener.parser);
            }
            if (!replace_1.status.inProgress) {
                replace_1.status.inProgress = true;
                status_bar_1.StatusBar.fetching("");
                status_bar_1.StatusBar.show();
                return listener?.parseAndDecorate(editor).finally(() => {
                    replace_1.status.inProgress = false;
                });
            }
        }
    }
    return Promise.resolve();
}
function replaceItemList(deps) {
    // filter out items without versions or value equals version index 0
    replace_1.status.replaceItems = deps
        .filter(i => i.versions && i.versions.length > 1 && i.versions[0] !== i.item.value)
        .map(i => ({ range: i.item.range, value: i.versions?.[0] }));
}
//# sourceMappingURL=listener.js.map