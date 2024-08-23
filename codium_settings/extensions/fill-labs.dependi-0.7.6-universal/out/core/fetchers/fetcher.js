"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fetcher = void 0;
const dialogs_1 = require("../../ui/dialogs");
class Fetcher {
    constructor(url, ignoreUnstable, urlKey) {
        this.URL = "";
        this.ignoreUnstable = true;
        if (!URL) {
            (0, dialogs_1.openSettingsDialog)(urlKey, "Please set the URL for the fetcher");
            return;
        }
        // delete double slashes in the URL
        let clean_url = url.replace("///", "");
        // delete trailing slashes in the URL
        if (clean_url.endsWith("/")) {
            clean_url = clean_url.slice(0, -1);
        }
        this.URL = clean_url;
        this.ignoreUnstable = this.ignoreUnstable;
    }
}
exports.Fetcher = Fetcher;
//# sourceMappingURL=fetcher.js.map