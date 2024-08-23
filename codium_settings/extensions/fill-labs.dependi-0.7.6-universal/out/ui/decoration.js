"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = decoration;
/**
 * Helps to manage decorations for the TOML files.
 */
const vscode_1 = require("vscode");
const semver_1 = require("semver");
const config_1 = require("../config");
const Language_1 = require("../core/Language");
const semverUtils_1 = require("../semver/semverUtils");
/**
 * Create a decoration for the given crate.
 * @param editor
 * @param crate
 * @param version
 * @param versions
 */
function decoration(editor, item, versions, decorationPreferences, lang, vuln, error) {
    // Also handle json valued dependencies
    const version = item.value?.replace(",", "");
    const [satisfies, hasPatchUpdate, maxSatisfying] = (0, semverUtils_1.checkVersion)(version, versions);
    const formatError = (error) => {
        // Markdown does not like newlines in middle of emphasis, or spaces next to emphasis characters.
        const error_parts = error.split('\n');
        const markdown = new vscode_1.MarkdownString("#### Errors ");
        markdown.appendMarkdown("\n");
        // Ignore empty strings
        error_parts.filter(s => s).forEach(part => {
            markdown.appendMarkdown("* ");
            markdown.appendText(part.trim()); // Gets rid of Markdown-breaking spaces, then append text safely escaped.
            markdown.appendMarkdown("\n"); // Put the newlines back
        });
        return markdown;
    };
    let hoverMessage = new vscode_1.MarkdownString();
    const position = decorationPreferences.position;
    const renderOptions = {
        [position]: {
            contentText: "",
        }
    };
    let type = "COMP";
    if (error) {
        hoverMessage = formatError(error);
        type = "ERROR";
    }
    else {
        appendVulnerabilities(hoverMessage, vuln, version);
        hoverMessage.appendMarkdown("#### Versions");
        hoverMessage.appendMarkdown(getLinks(lang, item.key));
        hoverMessage.isTrusted = true;
        // Build markdown hover text
        appendVersions(hoverMessage, versions, item, maxSatisfying ?? "", vuln, decorationPreferences, lang);
        if (version == "?") {
            const version = versions[0];
            const info = {
                value: version,
                range: item.range,
            };
            editor.edit((edit) => {
                edit.replace(item.range, info.value.substr(1, info.value.length - 2));
            });
            editor.document.save();
        }
        if (!(0, semver_1.validRange)(version)) {
            type = "ERROR";
        }
        else if (versions[0] !== maxSatisfying) {
            type = satisfies ? "COMP" : "INCOMP";
        }
        if (hasPatchUpdate && type === "COMP") {
            type = "PATCH";
        }
    }
    const contentText = getContentText(decorationPreferences, type);
    renderOptions[position].contentText = contentText.replace("${version}", versions[0]);
    const vulnerabilities = vuln?.get(version);
    if (vulnerabilities && vulnerabilities.length > 0) {
        const vulnText = decorationPreferences.vulnText.replace("${count}", `${vulnerabilities?.length}`);
        renderOptions[position].contentText = renderOptions[position].contentText + "\t" + vulnText;
    }
    // if local dependency, remove the content text just add version listing
    if (isLocal(version)) {
        renderOptions[position].contentText = "";
    }
    const deco = {
        range: position == "after" ? item.decoRange : new vscode_1.Range(item.line, 0, item.line, item.endOfLine),
        hoverMessage,
        renderOptions,
    };
    return [deco, type];
}
function isLocal(version) {
    if (!version)
        return false;
    return version.startsWith("file:") ||
        version.startsWith("path:") ||
        version.startsWith("link:") ||
        version.startsWith("git:") ||
        version.startsWith("git+") ||
        version.startsWith("github:") ||
        version.startsWith("workspace:") ||
        version.startsWith("ssh:") ||
        version.startsWith("http:") ||
        version.startsWith("https:");
}
function getContentText(decorationPreferences, type) {
    let contentText = decorationPreferences.compatibleText;
    switch (type) {
        case "PATCH":
            contentText = decorationPreferences.patchUpdateText;
            break;
        case "INCOMP":
            contentText = decorationPreferences.incompatibleText;
            break;
        case "ERROR":
            contentText = decorationPreferences.errorText;
            break;
    }
    return contentText;
}
function getLinks(lang, key) {
    const cleanKey = key.replace(/"/g, "");
    switch (lang) {
        case Language_1.Language.Rust:
            return ` _([View crate](https://crates.io/crates/${cleanKey}) | [Check reviews](https://web.crev.dev/rust-reviews/crate/${cleanKey}))_`;
        case Language_1.Language.Golang:
            return ` _([View module](https://pkg.go.dev/${cleanKey}) | [Check docs](https://pkg.go.dev/${cleanKey}#section-documentation))_`;
        case Language_1.Language.JS:
            return ` _([View package](https://npmjs.com/package/${cleanKey}))_`;
        case Language_1.Language.PHP:
            return ` _([View package](https://packagist.org/packages/${cleanKey}))_`;
        case Language_1.Language.Python:
            return ` _([View package](https://pypi.org/project/${cleanKey}))_`;
        default:
            return '';
    }
}
function getDocsLink(lang, key, version) {
    switch (lang) {
        case Language_1.Language.Rust:
            return `[(docs)](https://docs.rs/crate/${key}/${version})`;
        case Language_1.Language.Golang:
            return `[(docs)](https://pkg.go.dev/${key}@${version}#section-documentation)`;
        case Language_1.Language.JS:
            return `[(docs)](https://npmjs.com/package/${key}/v/${version})`;
        case Language_1.Language.PHP:
            return `[(docs)](https://packagist.org/packages/${key}#${version})`;
        case Language_1.Language.Python:
            return `[(docs)](https://pypi.org/project/${key}/${version})`;
        default:
            return '';
    }
}
function appendVulnerabilities(hoverMessage, vuln, version) {
    const v = vuln?.get(version);
    if (v?.length) {
        hoverMessage.appendMarkdown("#### Vulnerabilities (Current)");
        const vulnTexts = [];
        v?.forEach((v) => {
            const tmp = ` - [${v}](https://osv.dev/vulnerability/${v}) \n`;
            vulnTexts.push(tmp);
        });
        hoverMessage.appendMarkdown("\n" + vulnTexts.join(""));
    }
}
function appendVersions(hoverMessage, versions, item, maxSatisfying, vuln, decorationPreferences, lang) {
    for (let i = 0; i < versions.length; i++) {
        const version = versions[i];
        const v = vuln?.get(version);
        const replaceData = {
            value: version,
            range: {
                start: { line: item.range.start.line, character: item.range.start.character },
                end: { line: item.range.end.line, character: item.range.end.character },
            }
        };
        const isCurrent = version === maxSatisfying;
        const encoded = encodeURI(JSON.stringify(replaceData));
        const docs = (i === 0 || isCurrent) ? (' ' + getDocsLink(lang, item.key, version)) : "";
        const vulnText = v?.length ? decorationPreferences.vulnText.replace("${count}", `${v?.length}`) : "";
        const command = `${isCurrent ? "**" : ""}[${version}](command:${config_1.Configs.REPLACE_VERSIONS}?${encoded})${docs}${isCurrent ? "**" : ""}  ${vulnText}`;
        hoverMessage.appendMarkdown("\n * ");
        hoverMessage.appendMarkdown(command);
    }
}
//# sourceMappingURL=decoration.js.map