"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGitConflictLine = isGitConflictLine;
exports.isQuote = isQuote;
exports.isDisabledLine = isDisabledLine;
exports.shouldIgnoreLine = shouldIgnoreLine;
exports.isDisablePatternLine = isDisablePatternLine;
function isGitConflictLine(line) {
    switch (line[0]) {
        case "<":
            return line.startsWith("<<<<<<<");
        case "=":
            return line.startsWith("=======");
        case ">":
            return line.startsWith(">>>>>>>");
        default:
            return false;
    }
}
function isQuote(ch) {
    return ch === '"' || ch === "'";
}
function isDisabledLine(line) {
    return line.includes("dependi:") && line.includes("disable-check");
}
function shouldIgnoreLine(line, pattern, commandChar) {
    if (line.isEmptyOrWhitespace) {
        return true;
    }
    let column = line.firstNonWhitespaceCharacterIndex;
    const firstChar = line.text[column];
    // check if the line is a comment or unwanted line
    if (commandChar && commandChar.includes(firstChar)) {
        return true;
    }
    if (isDisabledLine(line.text)) {
        return true;
    }
    if (isGitConflictLine(line.text)) {
        return true;
    }
    if (isDisablePatternLine(line.text, pattern)) {
        return true;
    }
    return false;
}
function isDisablePatternLine(line, pattern) {
    line = line.trim();
    if (pattern.startsWith("*") && pattern.endsWith("*")) {
        const trimmedPattern = pattern.slice(1, -1);
        return line.includes(trimmedPattern);
    }
    else if (pattern.startsWith("*")) {
        const trimmedPattern = pattern.slice(1);
        return line.endsWith(trimmedPattern);
    }
    else if (pattern.endsWith("*")) {
        const trimmedPattern = pattern.slice(0, -1);
        return line.startsWith(trimmedPattern);
    }
    return false;
}
//# sourceMappingURL=utils.js.map