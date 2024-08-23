"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const Language_1 = require("../../../core/Language");
const compareVersions_1 = __importDefault(require("../../../semver/compareVersions"));
/*
A negative value indicates that a should come before b.
A positive value indicates that a should come after b.
Zero or NaN indicates that a and b are considered equal.
*/
test('compareVersions python test', () => {
    const tests = [
        ['1.0.0', '1.0.0', 0],
        ['1.0.0', '2.0.0', -1],
        ['2.0.0', '1.0.0', 1],
        ['1.0.0', '1.0.1', -1],
        ['1.0.1', '1.0.0', 1],
        ['1.0.0', '1.1.0', -1],
        ['1.1.0', '1.0.0', 1],
        ['0.12.3', '0.12.dev2', 1],
        ['0.12.dev2', '0.12.3', -1],
        ['0.12.dev2', '0.12.dev3', -1],
        ['0.12.dev3', '0.12.dev2', 1],
        ['0.12.dev3', '0.12', -1],
        ['0.12', '0.12.dev3', 1],
        ['1.0.0.alpha', '1.0.0', -1],
        ['1.0.0', '1.0.0.alpha', 1],
        ['1.0.0.alpha', '1.0.0.alpha.1', -1],
        ['1.0.0.alpha.1', '1.0.0.alpha', 1],
        ['1.0.0.alpha', '1.0.0.beta', -1],
        ['1.0.0.beta', '1.0.0.alpha', 1],
        ['1.0.0.alpha', '1.0.0.alpha.beta', -1],
        ['1.0.0.alpha.beta', '1.0.0.alpha', 1],
        ['1.0.0.alpha', '1.0.0.beta.2', -1],
        ['1.0.0.beta.2', '1.0.0.alpha', 1],
        ['1.0.0.alpha.1', '1.0.0.alpha.beta', -1],
        ['1.0.0.alpha.beta', '1.0.0.alpha.1', 1],
        ['1.0.0.alpha.beta', '1.0.0.beta', -1],
        ['1.0.0.beta', '1.0.0.alpha.beta', 1],
        ['1.0.0.alpha.beta', '1.0.0.beta.2', -1],
        ['1.0.0.beta.2', '1.0.0.alpha.beta', 1],
        ['1.0.0.alpha.beta.1', '1.0.0.alpha.beta]2', -1],
    ];
    (0, Language_1.setLanguage)("requirements.txt");
    for (const [v1, v2, expected] of tests) {
        assert_1.default.strictEqual((0, compareVersions_1.default)(v1, v2), expected, ` ${v1} ${v2}`);
    }
});
// ['1.0.0', '1.0.0-alpha', 1],
// ['1.0.0-alpha', '1.0.0', -1],
// ['1.0.0-alpha', '1.0.0-alpha', 0],
// ['1.0.0-alpha', '1.0.0-alpha.1', -1],
// ['1.0.0-alpha.1', '1.0.0-alpha', 1],
// ['1.0.0-alpha', '1.0.0-beta', -1],
// ['1.0.0-beta', '1.0.0-alpha', 1],
// ['1.0.0-alpha', '1.0.0-alpha.beta', -1],
// ['1.0.0-alpha.beta', '1.0.0-alpha', 1],
// ['1.0.0-alpha', '1.0.0-beta.2', -1],
// ['1.0.0-beta.2', '1.0.0-alpha', 1],
// ['1.0.0-alpha.1', '1.0.0-alpha.beta', -1],
// ['1.0.0-alpha.beta', '1.0.0-alpha.1', 1],
// ['1.0.0-alpha.beta', '1.0.0-beta', -1],
// ['1.0.0-beta', '1.0.0-alpha.beta', 1],
// ['1.0.0-alpha.beta', '1.0.0-beta.2', -1],
// ['1.0.0-beta.2', '1.0.0-alpha.beta', 1],
// ['1.0.0-alpha.beta.1', '1.0.0-alpha.beta.2', -1]
//# sourceMappingURL=compareVersions.test.js.map