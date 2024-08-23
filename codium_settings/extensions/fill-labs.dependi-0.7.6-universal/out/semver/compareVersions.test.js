"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compareVersions_1 = __importDefault(require("./compareVersions"));
function testCompareVersions() {
    const tests = [
        ['1.0.0', '1.0.0', 0],
        ['1.0.0', '2.0.0', -1],
        ['2.0.0', '1.0.0', 1],
        ['1.0.0', '1.0.1', -1],
        ['1.0.1', '1.0.0', 1],
        ['1.0.0', '1.1.0', -1],
        ['1.1.0', '1.0.0', 1],
        ['1.0.0', '1.0.0-alpha', 1],
        ['1.0.0-alpha', '1.0.0', -1],
        ['1.0.0-alpha', '1.0.0-alpha', 0],
        ['1.0.0-alpha', '1.0.0-alpha.1', -1],
        ['1.0.0-alpha.1', '1.0.0-alpha', 1],
        ['1.0.0-alpha', '1.0.0-beta', -1],
        ['1.0.0-beta', '1.0.0-alpha', 1],
        ['1.0.0-alpha', '1.0.0-alpha.beta', -1],
        ['1.0.0-alpha.beta', '1.0.0-alpha', 1],
        ['1.0.0-alpha', '1.0.0-beta.2', -1],
        ['1.0.0-beta.2', '1.0.0-alpha', 1],
        ['1.0.0-alpha.1', '1.0.0-alpha.beta', -1],
        ['1.0.0-alpha.beta', '1.0.0-alpha.1', 1],
        ['1.0.0-alpha.beta', '1.0.0-beta', -1],
        ['1.0.0-beta', '1.0.0-alpha.beta', 1],
        ['1.0.0-alpha.beta', '1.0.0-beta.2', -1],
        ['1.0.0-beta.2', '1.0.0-alpha.beta', 1],
        ['1.0.0-alpha.beta.1', '1.0.0-alpha.beta.2', -1]
    ];
    for (const [v1, v2, expected] of tests) {
        const actual = (0, compareVersions_1.default)(v1, v2);
        if (actual !== expected) {
            console.error(`Expected ${expected} but got ${actual} for ${v1} and ${v2}`);
        }
    }
    testCompareVersions();
}
//# sourceMappingURL=compareVersions.test.js.map