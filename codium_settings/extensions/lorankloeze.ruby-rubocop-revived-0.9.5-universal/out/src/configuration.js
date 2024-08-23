"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onDidChangeConfiguration = exports.getConfig = void 0;
const vs = require("vscode");
const fs = require("fs");
const cp = require("child_process");
const path = require("path");
const channel_1 = require("./channel");
const detectBundledRubocop = () => {
    let found;
    try {
        (0, channel_1.log)("detectBundledRubocop: bundle show rubocop");
        cp.execSync('bundle show rubocop', { cwd: vs.workspace.rootPath });
        found = true;
    }
    catch (e) {
        found = false;
    }
    (0, channel_1.log)(`detectBundledRubocop: ${found}`);
    return found;
};
const autodetectExecutePath = (cmd) => {
    const key = 'PATH';
    const paths = process.env[key];
    if (!paths) {
        return '';
    }
    const pathparts = paths.split(path.delimiter);
    for (let i = 0; i < pathparts.length; i++) {
        const binpath = path.join(pathparts[i], cmd);
        if (fs.existsSync(binpath)) {
            return pathparts[i] + path.sep;
        }
    }
    return '';
};
/**
 * Read the workspace configuration for 'ruby.rubocop' and return a RubocopConfig.
 * @return {RubocopConfig} config object
 */
const getConfig = () => {
    const win32 = process.platform === 'win32';
    const cmd = win32 ? 'rubocop.bat' : 'rubocop';
    const conf = vs.workspace.getConfiguration('ruby.rubocop');
    let useBundler = conf.get('useBundler', false);
    const useServer = conf.get('useServer', false);
    const configPath = conf.get('executePath', '');
    const suppressRubocopWarnings = conf.get('suppressRubocopWarnings', false);
    const hideDisableSuggestions = conf.get('hideDisableSuggestions', false);
    let command;
    // if executePath is present in workspace config, use it.
    if (configPath.length !== 0) {
        command = configPath + cmd;
    }
    else if (useBundler || detectBundledRubocop()) {
        useBundler = true;
        command = `bundle exec ${cmd}`;
    }
    else {
        const detectedPath = autodetectExecutePath(cmd);
        if (0 === detectedPath.length) {
            vs.window.showWarningMessage('execute path is empty! please check ruby.rubocop.executePath');
        }
        command = detectedPath + cmd;
    }
    return {
        command,
        configFilePath: conf.get('configFilePath', ''),
        onSave: conf.get('onSave', true),
        autocorrectOnSave: conf.get('autocorrectOnSave', false),
        useBundler,
        useServer,
        suppressRubocopWarnings,
        hideDisableSuggestions,
    };
};
exports.getConfig = getConfig;
const onDidChangeConfiguration = (rubocop) => {
    return () => (rubocop.config = (0, exports.getConfig)());
};
exports.onDidChangeConfiguration = onDidChangeConfiguration;
//# sourceMappingURL=configuration.js.map