"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CargoTomlParser = void 0;
const config_1 = require("../../config");
const TomlParser_1 = require("./TomlParser");
class CargoTomlParser extends TomlParser_1.TomlParser {
    constructor() {
        super(config_1.Settings.rust.ignoreLinePattern);
    }
}
exports.CargoTomlParser = CargoTomlParser;
//# sourceMappingURL=CargoTomlParser.js.map