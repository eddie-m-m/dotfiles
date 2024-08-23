"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
/**
 * Item is a data structure to define parsed items, hierarchy and index.
 */
class Item {
    constructor(item) {
        this.key = "";
        this.values = [];
        this.value = "";
        this.start = -1;
        this.end = -1;
        this.line = -1;
        this.endOfLine = -1;
        this.range = new vscode_1.Range(0, 0, 0, 0);
        this.decoRange = new vscode_1.Range(0, 0, 0, 0);
        if (item) {
            this.key = item.key;
            this.values = item.values;
            this.value = item.value;
            this.start = item.start;
            this.end = item.end;
            this.line = item.line;
            this.decoRange = item.decoRange;
        }
    }
    /**
     * Copy value, start,end ,line from
     */
    copyFrom(key, value, start, end, line, endOfLine) {
        if (key)
            this.key = key;
        if (value)
            this.value = value;
        if (start)
            this.start = start;
        if (end)
            this.end = end;
        if (line)
            this.line = line;
        if (endOfLine)
            this.endOfLine = endOfLine;
    }
    /**Create Range */
    createRange() {
        this.range = new vscode_1.Range(this.line, this.start, this.line, this.end);
    }
    /**Create Decoration Range */
    createDecoRange() {
        this.decoRange = new vscode_1.Range(this.line, this.start, this.line, this.endOfLine);
    }
    isValid() {
        return this.key.length > 0 && this.value?.length && this.start > -1 && this.end > -1;
    }
}
exports.default = Item;
//# sourceMappingURL=Item.js.map