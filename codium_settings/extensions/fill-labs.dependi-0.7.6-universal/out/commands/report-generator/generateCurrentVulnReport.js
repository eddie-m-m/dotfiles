"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCurrentVulnReport = void 0;
const vscode_1 = require("vscode");
const config_1 = require("../../config");
const reportGenerator_1 = require("./reportGenerator");
const VulnerabilityReportPanel_1 = require("../../panels/VulnerabilityReportPanel");
/**
 *
 * @param context
 * Generate the vulnerability report for the current repository and active file. Creates a WebView panel to display the report.
 * @returns
 */
const generateCurrentVulnReport = (context) => vscode_1.commands.registerCommand(config_1.Configs.GENERATE_VULNERABILITY_CURRENT_REPORT, async () => {
    const progressOptions = {
        location: vscode_1.ProgressLocation.Notification,
        title: "Loading Report",
        cancellable: false,
    };
    vscode_1.window.withProgress(progressOptions, reportGenerator_1.generateCurrentReport).then((fetchedHTML) => {
        if (!fetchedHTML) {
            return;
        }
        VulnerabilityReportPanel_1.VulnerabilityReportPanel.render(context.extensionUri, fetchedHTML);
    }, (error) => {
        vscode_1.window.showErrorMessage(`Report generation failed: ${error}`);
    });
});
exports.generateCurrentVulnReport = generateCurrentVulnReport;
//# sourceMappingURL=generateCurrentVulnReport.js.map