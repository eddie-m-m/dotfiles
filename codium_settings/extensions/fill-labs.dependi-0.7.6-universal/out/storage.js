"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionStorage = void 0;
const crypto_1 = require("crypto");
const semver_1 = require("semver");
const config_1 = require("./config");
const keys = {
    // dont sync
    deviceID: config_1.Configs.DEVICE_ID,
    // sync
    shownVersion: config_1.Configs.SHOWN_VERSION,
};
class ExtensionStorage {
    constructor(context) {
        this.context = context;
        this.context.globalState.setKeysForSync([keys.shownVersion]);
    }
    initDeviceID() {
        let deviceID = this.getDeviceID();
        if (!deviceID || deviceID.length !== 36) {
            const rID = (0, crypto_1.randomUUID)();
            return this.setDeviceID(rID).then(() => rID);
        }
        return Promise.resolve(deviceID);
    }
    setDeviceID(deviceID) {
        console.debug('setDeviceID', deviceID);
        return this.context.globalState.update(keys.deviceID, deviceID);
    }
    getDeviceID() {
        console.debug('getDeviceID', this.context.globalState.get(keys.deviceID));
        return this.context.globalState.get(keys.deviceID);
    }
    setShownVersion(version) {
        console.debug('setShownVersion', version);
        return this.context.globalState.update(keys.shownVersion, version);
    }
    getShownVersion() {
        console.debug('getShownVersion', this.context.globalState.get(keys.shownVersion));
        return this.context.globalState.get(keys.shownVersion);
    }
    shouldShowWelcomePage(version) {
        return (0, semver_1.gt)(version, this.getShownVersion() ?? '0.0.0');
    }
    isFirstInstall() {
        return !this.getShownVersion();
    }
}
exports.ExtensionStorage = ExtensionStorage;
//# sourceMappingURL=storage.js.map