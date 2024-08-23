"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = exports.Configs = exports.DEPENDI = void 0;
const vscode_1 = require("vscode");
exports.DEPENDI = "dependi.";
const WORKBENCH_ACTIONS = "workbench.action.";
var Configs;
(function (Configs) {
    Configs["RUST_ENABLED"] = "rust.enabled";
    Configs["RUST_INDEX_SERVER_URL"] = "rust.indexServerURL";
    Configs["RUST_IGNORE_UNSTABLES"] = "rust.excludeUnstableVersions";
    Configs["RUST_IGNORE_LINE_PATTERN"] = "rust.ignoreLinePattern";
    Configs["RUST_INFORM_PATCH_UPDATES"] = "rust.informPatchUpdates";
    Configs["NPM_ENABLED"] = "npm.enabled";
    Configs["NPM_INDEX_SERVER_URL"] = "npm.indexServerURL";
    Configs["NPM_IGNORE_UNSTABLES"] = "npm.excludeUnstableVersions";
    Configs["NPM_IGNORE_LINE_PATTERN"] = "npm.ignoreLinePattern";
    Configs["NPM_INFORM_PATCH_UPDATES"] = "npm.informPatchUpdates";
    Configs["PHP_ENABLED"] = "php.enabled";
    Configs["PHP_INDEX_SERVER_URL"] = "php.indexServerURL";
    Configs["PHP_IGNORE_UNSTABLES"] = "php.excludeUnstableVersions";
    Configs["PHP_IGNORE_LINE_PATTERN"] = "php.ignoreLinePattern";
    Configs["PHP_INFORM_PATCH_UPDATES"] = "php.informPatchUpdates";
    Configs["GO_ENABLED"] = "go.enabled";
    Configs["GO_INDEX_SERVER_URL"] = "go.indexServerURL";
    Configs["GO_IGNORE_UNSTABLES"] = "go.excludeUnstableVersions";
    Configs["GO_IGNORE_LINE_PATTERN"] = "go.ignoreLinePattern";
    Configs["GO_INFORM_PATCH_UPDATES"] = "go.informPatchUpdates";
    Configs["PYTHON_ENABLED"] = "python.enabled";
    Configs["PYTHON_INDEX_SERVER_URL"] = "python.indexServerURL";
    Configs["PYTHON_IGNORE_UNSTABLES"] = "python.excludeUnstableVersions";
    Configs["PYTHON_IGNORE_LINE_PATTERN"] = "python.ignoreLinePattern";
    Configs["PYTHON_INFORM_PATCH_UPDATES"] = "python.informPatchUpdates";
    Configs["VULS_ENABLED"] = "vulnerability.enabled";
    Configs["VULS_GHSA_ENABLED"] = "vulnerability.ghsa.enabled";
    Configs["VULS_OSV_BATCH_URL"] = "vulnerability.osvQueryURL.batch";
    Configs["VULS_OSV_URL"] = "vulnerability.osvQueryURL.single";
    Configs["INDEX_SERVER_API_KEY"] = "apiKey";
    Configs["INDEX_SERVER_URL"] = "apiURL";
    Configs["DECORATOR_POSITION"] = "decoration.position";
    Configs["ERROR_DECORATOR"] = "decoration.error.template";
    Configs["ERROR_DECORATOR_CSS"] = "decoration.error.style";
    Configs["INCOMPATIBLE_DECORATOR"] = "decoration.incompatible.template";
    Configs["INCOMPATIBLE_DECORATOR_CSS"] = "decoration.incompatible.style";
    Configs["PATCH_UPDATE_DECORATOR"] = "decoration.patchUpdate.template";
    Configs["PATCH_UPDATE_DECORATOR_CSS"] = "decoration.patchUpdate.style";
    Configs["COMPATIBLE_DECORATOR"] = "decoration.compatible.template";
    Configs["COMPATIBLE_DECORATOR_CSS"] = "decoration.compatible.style";
    Configs["VULNERABILITY_DECORATOR"] = "decoration.vulnerability.template";
    //Commands
    Configs["REPLACE_VERSIONS"] = "dependi.commands.replaceVersion";
    Configs["GENERATE_VULNERABILITY_REPORT"] = "dependi.commands.vulnerability.report";
    Configs["GENERATE_VULNERABILITY_CURRENT_REPORT"] = "dependi.commands.vulnerability.currentReport";
    // CREATE_CHANGELOG = `${DEPENDI}createChangelog`,
    Configs["UPDATE_ALL"] = "dependi.commands.updateAll";
    Configs["RETRY"] = "dependi.commands.retry";
    //Storage
    Configs["DEVICE_ID"] = "dependi.deviceID";
    Configs["SHOWN_VERSION"] = "dependi.shownVersion";
})(Configs || (exports.Configs = Configs = {}));
exports.Settings = {
    version: "0.0.1",
    rust: {
        enabled: true,
        index: "",
        ignoreUnstable: false,
        ignoreLinePattern: "",
        informPatchUpdates: false
    },
    npm: {
        enabled: true,
        index: "",
        ignoreUnstable: false,
        ignoreLinePattern: "",
        informPatchUpdates: false
    },
    php: {
        enabled: true,
        index: "",
        ignoreUnstable: false,
        ignoreLinePattern: "",
        informPatchUpdates: false
    },
    go: {
        enabled: true,
        index: "",
        ignoreUnstable: false,
        ignoreLinePattern: "",
        informPatchUpdates: false
    },
    python: {
        enabled: true,
        index: "",
        ignoreUnstable: false,
        ignoreLinePattern: "",
        informPatchUpdates: false
    },
    vulnerability: {
        enabled: false,
        ghsa: false,
        osvBatch: "",
        osvSingle: ""
    },
    api: {
        key: "",
        url: "",
        proPanelURL: "https://www.dependi.io/pro",
        deviceID: ""
    },
    decorator: {
        position: "",
        error: {
            template: "",
            css: {}
        },
        incompatible: {
            template: "",
            css: {}
        },
        patchUpdate: {
            template: "",
            css: {}
        },
        compatible: {
            template: "",
            css: {}
        },
        vulnerability: {
            template: ""
        }
    },
    load: function () {
        const config = vscode_1.workspace.getConfiguration("dependi");
        // fill in the settings
        this.rust.enabled = config.get(Configs.RUST_ENABLED) ?? true;
        this.rust.index = config.get(Configs.RUST_INDEX_SERVER_URL) || "https://index.crates.io";
        this.rust.ignoreUnstable = config.get(Configs.RUST_IGNORE_UNSTABLES) ?? true;
        this.rust.ignoreLinePattern = config.get(Configs.RUST_IGNORE_LINE_PATTERN) || "";
        this.rust.informPatchUpdates = config.get(Configs.RUST_INFORM_PATCH_UPDATES) ?? false;
        this.npm.enabled = config.get(Configs.NPM_ENABLED) ?? true;
        this.npm.index = config.get(Configs.NPM_INDEX_SERVER_URL) || "https://registry.npmjs.org";
        this.npm.ignoreUnstable = config.get(Configs.NPM_IGNORE_UNSTABLES) ?? true;
        this.npm.ignoreLinePattern = config.get(Configs.NPM_IGNORE_LINE_PATTERN) || "";
        this.npm.informPatchUpdates = config.get(Configs.NPM_INFORM_PATCH_UPDATES) ?? false;
        this.php.enabled = config.get(Configs.PHP_ENABLED) ?? true;
        this.php.index = config.get(Configs.PHP_INDEX_SERVER_URL) || "https://repo.packagist.org";
        this.php.ignoreUnstable = config.get(Configs.PHP_IGNORE_UNSTABLES) ?? true;
        this.php.ignoreLinePattern = config.get(Configs.PHP_IGNORE_LINE_PATTERN) || "";
        this.php.informPatchUpdates = config.get(Configs.PHP_INFORM_PATCH_UPDATES) ?? false;
        this.go.enabled = config.get(Configs.GO_ENABLED) ?? true;
        this.go.index = config.get(Configs.GO_INDEX_SERVER_URL) || "https://proxy.golang.org";
        this.go.ignoreUnstable = config.get(Configs.GO_IGNORE_UNSTABLES) ?? true;
        this.go.ignoreLinePattern = config.get(Configs.GO_IGNORE_LINE_PATTERN) || "";
        this.go.informPatchUpdates = config.get(Configs.GO_INFORM_PATCH_UPDATES) ?? false;
        this.python.enabled = config.get(Configs.PYTHON_ENABLED) ?? true;
        this.python.index = config.get(Configs.PYTHON_INDEX_SERVER_URL) || "https://pypi.org/pypi";
        this.python.ignoreUnstable = config.get(Configs.PYTHON_IGNORE_UNSTABLES) ?? true;
        this.python.ignoreLinePattern = config.get(Configs.PYTHON_IGNORE_LINE_PATTERN) || "";
        this.python.informPatchUpdates = config.get(Configs.PYTHON_INFORM_PATCH_UPDATES) ?? false;
        this.vulnerability.enabled = config.get(Configs.VULS_ENABLED) ?? true;
        this.vulnerability.ghsa = config.get(Configs.VULS_GHSA_ENABLED) ?? false;
        this.vulnerability.osvBatch = config.get(Configs.VULS_OSV_BATCH_URL) || "https://api.osv.dev/v1/querybatch";
        this.vulnerability.osvSingle = config.get(Configs.VULS_OSV_URL) || "https://api.osv.dev/v1/query";
        this.api.key = config.get(Configs.INDEX_SERVER_API_KEY) || "";
        this.api.url = config.get(Configs.INDEX_SERVER_URL) || "https://index.dependi.io";
        this.decorator.position = config.get(Configs.DECORATOR_POSITION) || "after";
        this.decorator.error.template = config.get(Configs.ERROR_DECORATOR) || "❗️❗️❗️";
        this.decorator.error.css = config.get(Configs.ERROR_DECORATOR_CSS) || {};
        this.decorator.incompatible.template = config.get(Configs.INCOMPATIBLE_DECORATOR) || "❌ ${version}";
        this.decorator.incompatible.css = config.get(Configs.INCOMPATIBLE_DECORATOR_CSS) || {};
        this.decorator.patchUpdate.template = config.get(Configs.PATCH_UPDATE_DECORATOR) || "⚠️ ${version}";
        this.decorator.patchUpdate.css = config.get(Configs.PATCH_UPDATE_DECORATOR_CSS) || {};
        this.decorator.compatible.template = config.get(Configs.COMPATIBLE_DECORATOR) || "✅";
        this.decorator.compatible.css = config.get(Configs.COMPATIBLE_DECORATOR_CSS) || {};
        this.decorator.vulnerability.template = config.get(Configs.VULNERABILITY_DECORATOR) || "🚨 ${count}";
        console.debug("Settings loaded", this);
    },
    onChange: function (e) {
        if (e.affectsConfiguration("dependi")) {
            //TODO: traverse all keys and update the settings if they are changed
            console.debug("Config changed");
            this.load();
        }
    }
};
//# sourceMappingURL=config.js.map