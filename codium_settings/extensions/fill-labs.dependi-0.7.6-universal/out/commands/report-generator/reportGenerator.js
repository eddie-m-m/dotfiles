"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMainReport = generateMainReport;
exports.generateCurrentReport = generateCurrentReport;
const vscode_1 = require("vscode");
const reports_1 = require("../../api/index/dependi-index-server/reports");
const config_1 = require("../../config");
const gitActions_1 = require("./gitActions");
const utils_1 = require("./utils");
const progressSteps = {
    fetchingRepository: { label: "Fetching current repository", percentage: 5 },
    parsingFile: { label: "Parsing current file", percentage: 10 },
    comparingFiles: { label: "Comparing files", percentage: 25 },
    generatingReport: { label: "Generating vulnerability report", percentage: 55 },
    creatingUI: { label: "Creating Report", percentage: 80 },
};
async function fetchRepositoryData() {
    const { repo } = await (0, gitActions_1.getRepo)();
    const { commits } = await (0, gitActions_1.getCommitHistory)(repo);
    const { repoName, repoRootUri } = await (0, gitActions_1.getRepoDetails)();
    const commitId = commits[0]?.hash;
    if (!commitId) {
        throw new Error("No commits found in the repository.");
    }
    return { repo, commits, repoName, repoRootUri, commitId };
}
async function getActiveEditorLanguage() {
    const editor = vscode_1.window.activeTextEditor;
    if (!editor) {
        throw new Error("Active editor not found");
    }
    const filePath = editor.document.fileName || "";
    if (filePath === "") {
        throw new Error("File name has not been found.");
    }
    const fileName = filePath.split(/[/\\]/).pop();
    if (!fileName) {
        throw new Error("Failed to extract file name with extension.");
    }
    return { editor, fileName };
}
function incrementProgress(progress, step, totalPercentage) {
    const { percentage, label } = progressSteps[step];
    progress.report({
        increment: percentage,
        message: `Progress: ${totalPercentage + percentage}% ${label}`,
    });
    return totalPercentage + percentage;
}
async function parseFiles(parser, repo, commitId, activeFileLanguage) {
    const editor = vscode_1.window.activeTextEditor;
    if (!editor) {
        throw new Error("Active editor not found");
    }
    const currentItems = parser.parse(editor.document);
    const previousItems = await (0, gitActions_1.parseTextDocument)(parser, repo, commitId, activeFileLanguage);
    const currentReportItems = currentItems.map((item) => ({
        Key: item.key,
        Value: item.value || "",
    }));
    const previousReportItems = previousItems.map((item) => ({
        Key: item.key,
        Value: item.value || "",
    }));
    return { currentReportItems, previousReportItems };
}
async function generateMainReport(progress) {
    let totalPercentage = 0;
    try {
        totalPercentage = incrementProgress(progress, "fetchingRepository", totalPercentage);
        const { repo, commits, repoName, repoRootUri, commitId } = await fetchRepositoryData();
        const { fileName } = await getActiveEditorLanguage();
        totalPercentage = incrementProgress(progress, "parsingFile", totalPercentage);
        const parser = (0, utils_1.parserInvoker)(fileName);
        const { currentReportItems, previousReportItems } = await parseFiles(parser, repo, commitId, fileName);
        if (!repoRootUri) {
            throw new Error("Repository root URI not found");
        }
        totalPercentage = incrementProgress(progress, "generatingReport", totalPercentage);
        const vulnRequest = {
            RepoName: repoName || "",
            Commits: commits || [],
            PreviousItems: previousReportItems,
            CurrentItems: currentReportItems,
            Language: (0, reports_1.getLangIdFromName)(fileName),
            GHSACheck: config_1.Settings.vulnerability.ghsa,
        };
        const reportResp = await (0, reports_1.getVulnReport)(vulnRequest);
        if (!reportResp) {
            throw new Error("Failed to generate report");
        }
        (0, utils_1.handleReportError)(reportResp);
        const reportHTML = reportResp.body || "";
        totalPercentage = incrementProgress(progress, "creatingUI", totalPercentage);
        return reportHTML;
    }
    catch (error) {
        throw new Error(`Error during report generation: ${error}`);
    }
}
async function generateCurrentReport(progress) {
    let totalPercentage = 0;
    try {
        const { fileName } = await getActiveEditorLanguage();
        totalPercentage = incrementProgress(progress, "parsingFile", totalPercentage);
        const parser = (0, utils_1.parserInvoker)(fileName);
        const { reportItems } = await parseFile(parser);
        totalPercentage = incrementProgress(progress, "generatingReport", totalPercentage);
        const vulnRequest = {
            RepoName: "",
            Commits: [],
            PreviousItems: [],
            CurrentItems: reportItems,
            Language: (0, reports_1.getLangIdFromName)(fileName),
            GHSACheck: config_1.Settings.vulnerability.ghsa,
        };
        const reportResp = await (0, reports_1.getCurrentVulnReport)(vulnRequest);
        (0, utils_1.handleReportError)(reportResp);
        const reportHTML = reportResp.body || "";
        totalPercentage = incrementProgress(progress, "creatingUI", totalPercentage);
        return reportHTML;
    }
    catch (error) {
        throw new Error(`Error during report generation: ${error}`);
    }
}
async function parseFile(parser) {
    const editor = vscode_1.window.activeTextEditor;
    if (!editor) {
        throw new Error("Active editor not found");
    }
    const items = parser.parse(editor.document);
    const reportItems = items.map((item) => ({
        Key: item.key,
        Value: item.value || "",
    }));
    return { reportItems };
}
//# sourceMappingURL=reportGenerator.js.map