"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const compareVersions = require("compare-versions");
const underlines = ['\\=', '-', '`', ':', '\'', '"', '~', '\\^', '_', '\\*', '\\+', '#', '<', '>'];
class RstSectionProvider {
    provideDocumentSymbols(document, token) {
        const extension = vscode.extensions.getExtension('lextudio.restructuredtext');
        if (extension) {
            if (compareVersions(extension.packageJSON.version, '164.0.0') < 0) {
                return;
            }
        }
        const hierarchy = new Array();
        const roots = new Array();
        let stack = new Array();
        const lines = document.getText().split(/\r?\n/);
        let prev = '';
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (prev.length === 0) {
                prev = line;
                continue;
            }
            if (!line.match(new RegExp(`^(${underlines.map(char => char + '{' + prev.length + ',}').join('|')})\\s*$`))) {
                prev = line;
                continue;
            }
            const section = { name: prev, start: i - 1, end: 9999999, type: line[0], children: [] };
            if (stack.length) {
                if (section.type === stack[stack.length - 1].type) {
                    stack.pop().end = i - 2; // this will be next to it
                }
                else if (!hierarchy.includes(section.type)) {
                    hierarchy.push(section.type);
                }
                else {
                    const index = stack.findIndex(s => s.type === section.type);
                    if (index !== -1) {
                        while (stack.length > index) {
                            stack.pop().end = i - 2;
                        }
                    }
                    if (stack.length === 0) {
                        roots.push(section);
                        stack.push(section);
                        prev = line;
                        continue;
                    }
                }
                if (stack.length === 0) {
                    roots.push(section);
                }
                else {
                    stack[stack.length - 1].children.push(section);
                }
            }
            else {
                roots.push(section);
                hierarchy.push(section.type);
            }
            stack.push(section);
            prev = line;
        }
        const createDef = (section) => {
            const sym = new vscode.DocumentSymbol(section.name, '', vscode.SymbolKind.String, new vscode.Range(section.start, 0, section.end, 99999), new vscode.Range(section.start, 0, section.start + 1, section.name.length));
            sym.children = section.children.map(createDef);
            return sym;
        };
        return roots.map(createDef);
    }
}
function activate(context) {
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider({ language: 'restructuredtext' }, new RstSectionProvider()));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map