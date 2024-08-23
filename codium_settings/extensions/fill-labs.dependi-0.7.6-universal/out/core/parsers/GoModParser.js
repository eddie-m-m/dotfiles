"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoModParser = void 0;
const Item_1 = __importDefault(require("../Item"));
const utils_1 = require("./utils");
const config_1 = require("../../config");
class State {
    constructor() {
        this.inRequire = false;
        this.items = [];
        this.bypass = false;
    }
}
class GoModParser {
    parse(doc) {
        let state = new State();
        for (let row = 0; row < doc.lineCount; row++) {
            let line = doc.lineAt(row);
            if ((0, utils_1.shouldIgnoreLine)(line, config_1.Settings.go.ignoreLinePattern, ["/"])) {
                continue;
            }
            if (state.bypass) {
                continue;
            }
            if (isRequire(line)) {
                // from now on we are in require block read every line until we find the end of the block as dependencies
                state.inRequire = true;
                continue;
            }
            if (state.inRequire) {
                if (isBlockEnd(line)) {
                    state.inRequire = false;
                    continue;
                }
                let item = parseDependencyLine(line);
                item.createRange();
                item.createDecoRange();
                state.items.push(item);
            }
        }
        return state.items;
    }
}
exports.GoModParser = GoModParser;
function isRequire(line) {
    const start = line.firstNonWhitespaceCharacterIndex;
    return line.text.substring(start, start + 9) === "require (";
}
function isBlockEnd(line) {
    return line.text[line.firstNonWhitespaceCharacterIndex] === ")";
}
function parseDependencyLine(line) {
    // parse lines like 	example.com/othermodule v1.2.3
    let endOfName = line.text.indexOf(" ", line.firstNonWhitespaceCharacterIndex);
    let startOfVersion = endOfName + 1;
    let endOfVersion = line.text.indexOf(" ", startOfVersion);
    if (endOfVersion === -1) {
        endOfVersion = line.text.length;
    }
    let name = line.text.substring(line.firstNonWhitespaceCharacterIndex, endOfName);
    let version = line.text.substring(startOfVersion, endOfVersion);
    if ((0, utils_1.isQuote)(name[0]) && (0, utils_1.isQuote)(name[name.length - 1])) {
        name = name.substring(1, name.length - 1);
    }
    if ((0, utils_1.isQuote)(version[0]) && (0, utils_1.isQuote)(version[version.length - 1])) {
        version = version.substring(1, version.length - 1);
        startOfVersion++;
        endOfVersion--;
    }
    const item = new Item_1.default();
    item.copyFrom(name, version, startOfVersion, endOfVersion, line.lineNumber, line.range.end.character);
    return item;
}
//# sourceMappingURL=GoModParser.js.map