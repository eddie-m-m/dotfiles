"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TomlParser = exports.State = void 0;
const Item_1 = __importDefault(require("../Item"));
const utils_1 = require("./utils");
class State {
    constructor() {
        this.inInlineTable = false;
        this.inArray = false;
        this.isMultipleDepTable = false;
        this.isSingle = false;
        this.items = [];
        this.currentItem = new Item_1.default();
        this.bypass = false;
    }
}
exports.State = State;
class TomlParser {
    constructor(pattern) {
        this.pattern = pattern;
    }
    parse(doc) {
        let items = [];
        const state = new State();
        for (let row = 0; row < doc.lineCount; row++) {
            let line = doc.lineAt(row);
            if ((0, utils_1.shouldIgnoreLine)(line, this.pattern, ["#"])) {
                continue;
            }
            // if it is table  check if it is dependency table and its type, single or multiple
            if (isTable(line)) {
                state.bypass = false;
                // in new table if an single dependency is in process, push it to items and reset the state
                if (state.isSingle) {
                    this.addItem(state, items);
                }
                if (isDependencyTable(line.text)) {
                    state.isMultipleDepTable = true;
                    state.isSingle = false;
                }
                else if (isDependencySingle(line.text)) {
                    // if it is single dependency, create a new item and start parsing we need to get crate name from here
                    state.isMultipleDepTable = false;
                    state.isSingle = true;
                    state.currentItem = new Item_1.default();
                    // crate name is the last part of the table name
                    state.currentItem.key = line.text.substring(line.text.lastIndexOf(".") + 1, line.text.indexOf("]"));
                }
                else {
                    state.isMultipleDepTable = false;
                    state.isSingle = false;
                    state.bypass = true;
                }
                continue;
            }
            // if bypass is true, we need to skip the next line until new table is found
            if (state.bypass) {
                continue;
            }
            if (state.isMultipleDepTable) {
                // if it is multiple dependency table, we need to read pairs until we find another table
                const pair = parsePair(line.text, row);
                if (!pair) {
                    continue;
                }
                // since it is multiple depedency table we need to add the item
                state.currentItem.copyFrom(pair.key, pair.value, pair.start, pair.end, row, line.range.end.character);
                this.addItem(state, items);
                continue;
            }
            else {
                // we neet 2 things, version and package name from next rows until we find another table
                const pair = parsePair(line.text, row);
                if (!pair) {
                    continue;
                }
                switch (pair.key) {
                    case "version":
                        state.currentItem.copyFrom(undefined, pair.value, pair.start, pair.end, row, line.range.end.character);
                        continue;
                    case "package":
                        state.currentItem.copyFrom(pair.value);
                        continue;
                    case "features":
                    case "default-features":
                    case "path":
                    case "workspace":
                        continue;
                    default:
                    //TODO: handle inner pair dependencies
                }
            }
        }
        this.addItem(state, items);
        return items;
    }
    addItem(state, items) {
        if (!state.currentItem.isValid()) {
            return;
        }
        state.currentItem.createRange();
        state.currentItem.createDecoRange();
        items.push(state.currentItem);
        state.currentItem = new Item_1.default();
    }
}
exports.TomlParser = TomlParser;
function parsePair(line, row) {
    const item = new Item_1.default();
    let eqIndex = line.indexOf("=");
    if (eqIndex === -1) {
        return undefined;
    }
    row = eqIndex + 1;
    const commentIndex = line.indexOf("#");
    item.key = clearText(line.substring(0, eqIndex));
    item.key = item.key.replace(".version", "");
    item.value = clearText(line.substring(eqIndex + 1, commentIndex > -1 ? commentIndex : line.length));
    if (isBoolean(item.value) || item.value.includes("path")) {
        return undefined;
    }
    if (line.indexOf("{") > -1) {
        // json object
        parsePackage(line, item);
        parseVersion(line, item);
        return item.start > -1 ? item : undefined;
    }
    item.start = line.indexOf(item.value);
    item.end = item.start + item.value.length;
    return item.start > -1 ? item : undefined;
}
function parseVersion(line, item) {
    let i = item.start;
    let eqIndex = line.indexOf("version");
    if (eqIndex === -1) {
        return;
    }
    i = eqIndex + 7;
    while (i < line.length) {
        const ch = line[i];
        if (ch === "=") {
            item.start = i;
            parseVersionValue(line, item);
            return;
        }
        i++;
    }
    return;
}
function parseVersionValue(line, item) {
    let i = item.start;
    let foundAt = -1;
    let foundQuote = 0;
    // find prev quote
    while (i++ < line.length) {
        const ch = line[i];
        if ((0, utils_1.isQuote)(ch)) {
            foundQuote++;
            if (foundQuote === 2) {
                // if we found 2 quotes, we are done since it all rolls back by 1 increase by one before break
                i++;
                break;
            }
            continue;
        }
        if (isWhiteSpace(ch)) {
            if (foundAt > -1) {
                break;
            }
            continue;
        }
        else if (foundAt > -1)
            continue;
        foundAt = i;
    }
    i--;
    const found = line.substring(foundAt, i);
    if (isBoolean(found)) {
        return;
    }
    item.value = clearText(found);
    item.start = foundAt;
    item.end = item.start + item.value.length;
}
function parsePackage(line, item) {
    let i = item.start;
    let eqIndex = line.indexOf("package");
    if (eqIndex == -1) {
        return;
    }
    i = eqIndex + 7;
    while (i < line.length) {
        const ch = line[i];
        if (ch === "=") {
            parsePackageValue(line, item, i);
            return;
        }
        i++;
    }
}
function parsePackageValue(line, item, start) {
    let i = start;
    let foundAt = -1;
    while (i++ < line.length) {
        const ch = line[i];
        if (isWhiteSpace(ch) || (0, utils_1.isQuote)(ch)) {
            if (foundAt > -1) {
                break;
            }
            continue;
        }
        else if (foundAt > -1)
            continue;
        foundAt = i;
    }
    item.key = line.substring(foundAt, i);
}
function isWhiteSpace(ch) {
    return ch === " " || ch === "\t";
}
function isDependencyTable(line) {
    return line.includes("dependencies]");
}
function isDependencySingle(line) {
    return line.includes("dependencies.");
}
function isBoolean(value) {
    return value === "true" || value === "false";
}
function clearText(text) {
    return text.replace(/[^a-zA-Z0-9-_.*]/g, "").trim();
}
function isTable(line) {
    let column = line.firstNonWhitespaceCharacterIndex;
    const firstChar = line.text[column];
    return firstChar === "[";
}
//# sourceMappingURL=TomlParser.js.map