"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PypiParser = void 0;
exports.splitByComma = splitByComma;
exports.possibleLatestVersion = possibleLatestVersion;
const Item_1 = __importDefault(require("../Item"));
const utils_1 = require("./utils");
const config_1 = require("../../config");
class State {
    constructor() {
        this.items = [];
        this.bypass = false;
    }
}
class PypiParser {
    parse(doc) {
        let state = new State();
        for (let row = 0; row < doc.lineCount; row++) {
            let line = doc.lineAt(row);
            if ((0, utils_1.shouldIgnoreLine)(line, config_1.Settings.python.ignoreLinePattern, ["#", "-", "."])) {
                continue;
            }
            if (state.bypass) {
                continue;
            }
            let item = parseDependencyLine(line);
            item.line = line.lineNumber;
            item.createRange();
            item.createDecoRange();
            state.items.push(item);
        }
        return state.items;
    }
}
exports.PypiParser = PypiParser;
function getEndOfName(line) {
    const specialCharacters = [">", "<", "~", "!", "="];
    for (let i = 0; i < line.text.length; i++) {
        if (specialCharacters.includes(line.text[i])) {
            return i;
        }
    }
    // If no special character found, return -1
    return -1;
}
function parseDependencyLine(line) {
    // parse lines like 	python-dateutil==2.8.2
    let endOfName = getEndOfName(line);
    let startOfVersion = endOfName;
    let endOfVersion = line.text.length;
    let name = line.text.substring(line.firstNonWhitespaceCharacterIndex, endOfName);
    let version = line.text.substring(startOfVersion, endOfVersion);
    if (version.startsWith("==") ||
        version.startsWith(">=") ||
        version.startsWith("<=")) {
        startOfVersion += 2;
    }
    if (version.startsWith(">") ||
        version.startsWith("<") ||
        version.startsWith("!")) {
        startOfVersion += 1;
    }
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
function isValid(version, constraint) {
    if (constraint.startsWith("==")) {
        return version === constraint.slice(2);
    }
    else if (constraint.startsWith("!")) {
        return version !== constraint.slice(1);
    }
    else if (constraint.startsWith(">=")) {
        return compareVersions(version, constraint.slice(2)) >= 0;
    }
    else if (constraint.startsWith("<=")) {
        return compareVersions(version, constraint.slice(2)) <= 0;
    }
    else if (constraint.startsWith(">")) {
        return compareVersions(version, constraint.slice(1)) > 0;
    }
    else if (constraint.startsWith("<")) {
        return compareVersions(version, constraint.slice(1)) < 0;
    }
    else {
        return false;
    }
}
function compareVersions(versionA, versionB) {
    const [vA, sA] = versionA.split(/[^\d.]/, 2); // Split version and suffix
    const [vB, sB] = versionB.split(/[^\d.]/, 2); // Split version and suffix
    const partsA = vA.split(".").map(Number);
    const partsB = vB.split(".").map(Number);
    for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
        const partA = partsA[i] || 0;
        const partB = partsB[i] || 0;
        if (partA < partB)
            return -1;
        if (partA > partB)
            return 1;
    }
    // If versions are equal, compare suffixes
    if (sA && sB) {
        return sA.localeCompare(sB);
    }
    else if (sA) {
        return 1; // versionA has a suffix, so it's greater
    }
    else if (sB) {
        return -1; // versionB has a suffix, so it's greater
    }
    else {
        return 0; // versions are equal and have no suffixes
    }
}
function splitByComma(str) {
    let splitString;
    if (str.includes(";")) {
        // If ';' exists, consider substring before ';'
        splitString = str
            .split(";")[0]
            .split(",")
            .map((substr) => substr.trim());
    }
    else {
        // If no ';', simply split by ','
        splitString = str.split(",").map((substr) => substr.trim());
    }
    return splitString;
}
function possibleLatestVersion(constraints, versions) {
    const exactVersionConstraint = constraints.find((constraint) => constraint.startsWith("=="));
    if (exactVersionConstraint) {
        if (constraints.some((constraint) => constraint.includes("*"))) {
            const majorVersion = constraints
                .find((constraint) => constraint.startsWith("=="))
                ?.slice(2)
                .split(".")[0];
            const filteredVersions = versions.filter((version) => version.startsWith(majorVersion || ""));
            return filteredVersions.length > 0
                ? filteredVersions.reduce((prev, curr) => compareVersions(prev, curr) >= 0 ? prev : curr)
                : null;
        }
        return exactVersionConstraint.slice(2);
    }
    else if (constraints.some((constraint) => constraint.includes("*"))) {
        const majorVersion = constraints
            .find((constraint) => constraint.startsWith("=="))
            ?.slice(2)
            .split(".")[0];
        const filteredVersions = versions.filter((version) => version.startsWith(majorVersion || ""));
        return filteredVersions.length > 0
            ? filteredVersions.reduce((prev, curr) => compareVersions(prev, curr) >= 0 ? prev : curr)
            : null;
    }
    else {
        const possibleVersions = versions.filter((version) => constraints.every((constraint) => isValid(version, constraint)));
        return possibleVersions.length > 0
            ? possibleVersions.reduce((prev, curr) => compareVersions(prev, curr) >= 0 ? prev : curr)
            : null;
    }
}
//# sourceMappingURL=PypiParser.js.map