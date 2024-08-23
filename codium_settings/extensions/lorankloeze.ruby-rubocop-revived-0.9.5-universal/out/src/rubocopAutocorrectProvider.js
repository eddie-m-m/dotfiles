"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const cp = require("child_process");
const configuration_1 = require("./configuration");
const helper_1 = require("./helper");
const channel_1 = require("./channel");
class RubocopAutocorrectProvider {
    provideDocumentFormattingEdits(document) {
        return this.getAutocorrectEdits(document);
    }
    getAutocorrectEdits(document, additionalArguments = []) {
        const config = (0, configuration_1.getConfig)();
        try {
            const args = [...(0, helper_1.getCommandArguments)(document.fileName), ...additionalArguments];
            if (additionalArguments.length === 0)
                args.push('--autocorrect');
            if (config.useServer) {
                args.push('--server');
            }
            const options = {
                cwd: (0, helper_1.getCurrentPath)(document.uri),
                input: document.getText(),
            };
            const cmd = `${config.command} ${args.join(' ')}`;
            (0, channel_1.log)(`autocorrect: ${cmd}`);
            let stdout;
            if (config.useBundler) {
                stdout = cp.execSync(cmd, options);
            }
            else {
                stdout = cp.execFileSync(config.command, args, options);
            }
            return this.onSuccess(document, stdout);
        }
        catch (e) {
            // if there are still some offences not fixed RuboCop will return status 1
            if (e.status !== 1) {
                (0, channel_1.log)(`autocorrect: error ${e}`);
                vscode.window.showWarningMessage('An error occurred during auto-correction');
                console.log(e);
                return [];
            }
            else {
                return this.onSuccess(document, e.stdout);
            }
        }
    }
    // Output of auto-correction looks like this:
    //
    // {"metadata": ... {"offense_count":5,"target_file_count":1,"inspected_file_count":1}}====================
    // def a
    //   3
    // end
    //
    // So we need to parse out the actual auto-corrected ruby
    onSuccess(document, stdout) {
        (0, channel_1.log)("autocorrect: done");
        const stringOut = stdout.toString();
        const autoCorrection = stringOut.match(/^.*\n====================(?:\n|\r\n)([.\s\S]*)/m);
        if (!autoCorrection) {
            throw new Error(`Error parsing auto-correction from CLI: ${stringOut}`);
        }
        return [
            new vscode.TextEdit(this.getFullRange(document), autoCorrection.pop()),
        ];
    }
    getFullRange(document) {
        return new vscode.Range(new vscode.Position(0, 0), document.lineAt(document.lineCount - 1).range.end);
    }
}
exports.default = RubocopAutocorrectProvider;
//# sourceMappingURL=rubocopAutocorrectProvider.js.map