"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRepo = getRepo;
exports.getRepoDetails = getRepoDetails;
exports.getCommitHistory = getCommitHistory;
exports.parseTextDocument = parseTextDocument;
const vscode_1 = require("vscode");
const utils_1 = require("./utils");
async function getRepo() {
    const gitExtension = vscode_1.extensions.getExtension("vscode.git").exports;
    if (!gitExtension) {
        throw new Error("Git extension not found");
    }
    const api = gitExtension.getAPI(1);
    const repos = api.repositories;
    if (!repos || repos.length === 0) {
        throw new Error("No repository found");
    }
    const activeEditor = vscode_1.window.activeTextEditor;
    if (!activeEditor) {
        throw new Error("Active editor not found");
    }
    const activeFilePath = activeEditor.document.uri.fsPath;
    const repo = repos.find((repo) => activeFilePath.includes(repo.rootUri.fsPath));
    return { repo };
}
async function getRepoDetails() {
    const { repo } = await getRepo();
    const repoRootUri = repo.rootUri;
    let repoName;
    const path = (0, utils_1.winHelper)(repoRootUri.path);
    if (repoRootUri) {
        repoName = path.split('/').pop();
    }
    return { repoName, repoRootUri };
}
async function getCommitHistory(repo) {
    const editor = vscode_1.window.activeTextEditor;
    if (!editor) {
        throw new Error("Active editor not found");
    }
    const uri = editor.document.uri;
    const newUriPath = (0, utils_1.winHelper)(uri.path);
    const commits = await repo.log({ path: newUriPath });
    if (!commits || commits.length === 0) {
        throw new Error("There is no commit history on the active file");
    }
    return { commits };
}
async function parseTextDocument(parser, repo, commitId, activeFileLanguage) {
    const uri = (0, utils_1.winHelper)(vscode_1.window.activeTextEditor.document.uri.path);
    const file = await repo.show(commitId, uri);
    const textDocumentFile = await vscode_1.workspace.openTextDocument({
        language: activeFileLanguage,
        content: file,
    });
    vscode_1.window.showTextDocument(textDocumentFile).then(() => vscode_1.commands.executeCommand("workbench.action.revertAndCloseActiveEditor"));
    return parser.parse(textDocumentFile);
}
//# sourceMappingURL=gitActions.js.map