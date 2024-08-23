"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PyProjectParser = void 0;
const config_1 = require("../../config");
const Item_1 = __importDefault(require("../Item"));
const TomlParser_1 = require("./TomlParser");
class PyProjectParser extends TomlParser_1.TomlParser {
    constructor() {
        super(config_1.Settings.python.ignoreLinePattern);
    }
    addItem(state, items) {
        if (!state.currentItem.isValid()) {
            return;
        }
        if (state.currentItem.key === "python") {
            return;
        }
        state.currentItem.createRange();
        state.currentItem.createDecoRange();
        items.push(state.currentItem);
        state.currentItem = new Item_1.default();
    }
}
exports.PyProjectParser = PyProjectParser;
//# sourceMappingURL=PyProjectParser.js.map