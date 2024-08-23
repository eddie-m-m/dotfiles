"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NpmParser = void 0;
const JsonParser_1 = require("./JsonParser");
class NpmParser extends JsonParser_1.JsonParser {
    constructor() {
        super('dependencies', 'devDependencies');
    }
    addDependency(item) {
        if (item.value?.startsWith('link:')) {
            return;
        }
        item.createRange();
        item.createDecoRange();
        this.state.items.push(item);
    }
}
exports.NpmParser = NpmParser;
//# sourceMappingURL=NpmParser.js.map