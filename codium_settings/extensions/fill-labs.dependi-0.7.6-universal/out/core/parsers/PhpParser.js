"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhpParser = void 0;
const JsonParser_1 = require("./JsonParser");
class PhpParser extends JsonParser_1.JsonParser {
    constructor() {
        super('require', 'require-dev');
    }
    addDependency(item) {
        // `php` is a special value, which is not a dependency but a restriction
        // on the php version (like `engine` in package.json)
        if (item.key === 'php') {
            return;
        }
        item.createRange();
        item.createDecoRange();
        this.state.items.push(item);
    }
}
exports.PhpParser = PhpParser;
//# sourceMappingURL=PhpParser.js.map