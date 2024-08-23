"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAgent = void 0;
exports.getReqOptions = getReqOptions;
const os_1 = __importDefault(require("os"));
const config_1 = require("../config");
const semverMajor = require("semver/functions/major");
function getOSInfo() {
    const platform = os_1.default.platform();
    const release = os_1.default.release();
    let osInfo = 'Unknown OS';
    switch (platform) {
        case 'win32':
            osInfo = 'Windows';
            if (release.startsWith('10'))
                osInfo += ' 10';
            else if (release.startsWith('6.3'))
                osInfo += ' 8.1';
            else if (release.startsWith('6.2'))
                osInfo += ' 8';
            else if (release.startsWith('6.1'))
                osInfo += ' 7';
            break;
        case 'darwin':
            osInfo = 'Mac OS X';
            const macVersion = release.split('.').slice(0, 2).join('.');
            osInfo += ` ${macVersion}`;
            break;
        case 'linux':
            osInfo = 'Linux';
            break;
        default:
            osInfo = platform;
    }
    return osInfo;
}
function customUserAgent() {
    return `Dependi (https://www.dependi.io) (${config_1.Settings.version}) - ${getOSInfo()}`;
}
exports.UserAgent = customUserAgent();
function getReqOptions(url) {
    const u = new URL(url);
    const options = {
        protocol: u.protocol,
        hostname: u.hostname,
        port: u.port,
        path: u.pathname + u.search,
        headers: {
            'User-Agent': exports.UserAgent
        },
    };
    return options;
}
//# sourceMappingURL=utils.js.map