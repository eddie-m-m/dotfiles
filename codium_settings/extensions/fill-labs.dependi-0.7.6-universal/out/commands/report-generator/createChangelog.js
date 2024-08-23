"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChangelog = createChangelog;
const fs = __importStar(require("fs"));
const vscode = __importStar(require("vscode"));
const vscode_1 = require("vscode");
/**
 * Reads the package.json file from the root of the workspace and returns the version of the project.
 * If there is an error during the process, it logs the error and returns null.
 *
 * @returns {string|null} - The version of the project as a string, or null if there was an error.
 */
function getVersionFromPackageJson() {
    try {
        //read the package.json file
        const workspaceFolder = vscode_1.workspace.workspaceFolders?.[0];
        const rootPath = workspaceFolder?.uri.fsPath;
        const packageJsonData = fs.readFileSync(`${rootPath}/package.json`, "utf8");
        // Parse as JSON
        const packageJson = JSON.parse(packageJsonData);
        // Return the version information
        return packageJson.version;
    }
    catch (error) {
        console.error("there was an error while reading the package.json file", error);
        return null;
    }
}
/**
 * Updates the version in the package.json file located in the root of the workspace.
 *
 * @param {string} newVersion - The new version to be set in the package.json file.
 *
 * This function does the following:
 * - Reads the package.json file from the root of the workspace.
 * - Assigns the new version number to the version field of the package.json object.
 * - Writes the updated package.json object back to the package.json file.
 * - Logs a message to the console indicating the new version number.
 */
function updatePackageVersion(newVersion) {
    // Read the package.json file
    const workspaceFolder = vscode_1.workspace.workspaceFolders?.[0];
    const rootPath = workspaceFolder?.uri.fsPath;
    const packageJsonPath = `${rootPath}/package.json`;
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    // Assign the new version number
    packageJson.version = newVersion;
    // Update the package.json file
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}
let versionFromPackageJson = getVersionFromPackageJson();
let currentVersion = versionFromPackageJson || "0.0.0";
var CommitTypes;
(function (CommitTypes) {
    CommitTypes["Build"] = "build";
    CommitTypes["BuildBreaking"] = "build!";
    CommitTypes["Ci"] = "ci";
    CommitTypes["CiBreaking"] = "ci!";
    CommitTypes["Chore"] = "chore";
    CommitTypes["ChoreBreaking"] = "chore!";
    CommitTypes["Docs"] = "docs";
    CommitTypes["DocsBreaking"] = "docs!";
    CommitTypes["Fix"] = "fix";
    CommitTypes["FixBreaking"] = "fix!";
    CommitTypes["Perf"] = "perf";
    CommitTypes["PerfBreaking"] = "perf!";
    CommitTypes["Revert"] = "revert";
    CommitTypes["RevertBreaking"] = "revert!";
    CommitTypes["Refactor"] = "refactor";
    CommitTypes["RefactorBreaking"] = "refactor!";
    CommitTypes["Style"] = "style";
    CommitTypes["StyleBreaking"] = "style!";
    CommitTypes["Test"] = "test";
    CommitTypes["TestBreaking"] = "test!";
    CommitTypes["Feat"] = "feat";
    CommitTypes["FeatBreaking"] = "feat!";
    CommitTypes["BreakingChanges"] = "breakingChanges";
})(CommitTypes || (CommitTypes = {}));
const commitTypes = [
    { type: CommitTypes.Build, section: "Build System" },
    { type: CommitTypes.BuildBreaking, section: "BREAKING CHANGES" },
    { type: CommitTypes.Ci, section: "Continuous Integration" },
    { type: CommitTypes.CiBreaking, section: "BREAKING CHANGES" },
    { type: CommitTypes.Chore, section: "Miscellaneous Chores" },
    { type: CommitTypes.ChoreBreaking, section: "BREAKING CHANGES" },
    { type: CommitTypes.Docs, section: "Documentation" },
    { type: CommitTypes.DocsBreaking, section: "BREAKING CHANGES" },
    { type: CommitTypes.Fix, section: "Bug Fixes" },
    { type: CommitTypes.FixBreaking, section: "BREAKING CHANGES" },
    { type: CommitTypes.Perf, section: "Performance Improvements" },
    { type: CommitTypes.PerfBreaking, section: "BREAKING CHANGES" },
    { type: CommitTypes.Revert, section: "Reverts" },
    { type: CommitTypes.RevertBreaking, section: "BREAKING CHANGES" },
    { type: CommitTypes.Refactor, section: "Code Refactoring" },
    { type: CommitTypes.RefactorBreaking, section: "Code Refactoring" },
    { type: CommitTypes.Style, section: "Styles" },
    { type: CommitTypes.StyleBreaking, section: "Styles" },
    { type: CommitTypes.Test, section: "Tests" },
    { type: CommitTypes.TestBreaking, section: "Tests" },
    { type: CommitTypes.Feat, section: "Features" },
    { type: CommitTypes.FeatBreaking, section: "BREAKING CHANGES" },
    { type: CommitTypes.BreakingChanges, section: "BREAKING CHANGES" },
];
/**
 * This command checks the commits in the Git repository and performs several operations based on the commits.
 * It uses the Git extension for Visual Studio Code to access the Git API.
 *
 * The operations it performs are:
 * - Retrieves the last 100 commits from the repository.
 * - Checks if each commit message follows the conventional commit format.
 * - Stores commit messages that follow the conventional commit format in an array.
 * - Retrieves or initializes cached data, which includes the hash of a commit and a version number.
 * - If the cached commit hash is empty or not found in the commit list, it processes all commits.
 * - If the cached commit hash is found in the commit list, it processes only the commits after the cached commit.
 * - After processing the commits, it increments the version number based on the commit messages.
 * - Updates the changelog with the new version number and the processed commit messages.
 * - Updates the cached data with the new version number and the hash of the latest commit.
 * - Updates the version number in the package.json file.
 *
 * @export
 * @const
 * @type {Command}
 */
async function createChangelog(context) {
    const gitExtension = vscode_1.extensions.getExtension("vscode.git").exports;
    if (!gitExtension) {
        vscode_1.window.showErrorMessage("Git extension not found");
        return;
    }
    const api = gitExtension.getAPI(1);
    const repo = api.repositories[0];
    const commits = await repo.log({ maxEntries: 100 });
    const conventionalCommit = [];
    let storageData = context.globalState.get("myData");
    if (!context.globalState.get("myData")) {
        context.globalState.update("myData", {
            hash: commits[commits.length - 1].hash,
            version: currentVersion,
        });
        storageData = context.globalState.get("myData");
    }
    storageData.version = getVersionFromPackageJson();
    const startIndex = commits.findIndex((commit) => commit.hash === storageData.hash);
    if (startIndex === -1) {
        //If the lastCommitId is not a valid commit id or not in the list, it processes all commits
        commits.map((commit) => {
            if (isConventionalCommit(commit.message)) {
                conventionalCommit.push({
                    message: commit.message,
                    hash: commit.hash,
                    date: commit.commitDate,
                });
            }
        });
        typeParser(conventionalCommit);
        const result = incrementVersion(conventionalCommit, storageData.version);
        storageData.version = result.currentVersion;
        updateChangeLog(storageData.version, conventionalCommit);
    }
    else {
        // if the lastCommitId is a valid commit id and in the list, it processes only the commits after the lastCommitId
        const filteredCommits = commits.slice(0, startIndex);
        filteredCommits.map((commit) => {
            if (isConventionalCommit(commit.message)) {
                conventionalCommit.push({
                    message: commit.message,
                    hash: commit.hash,
                    date: commit.commitDate,
                });
            }
        });
        const result = incrementVersion(conventionalCommit, storageData.version);
        storageData.version = result.currentVersion;
        updateChangeLog(storageData.version, conventionalCommit);
        typeParser(conventionalCommit);
    }
    storageData.hash = commits[0].hash; // updates the lastCommitId to the id of the last commit
    // cache.set("myData", storageData);
    updatePackageVersion(storageData.version); // update package.json version
    context.globalState.update("myData", storageData);
}
/**
 * Checks if a given commit message follows the conventional commit format.
 *
 * @param {string} commit - The commit message to be checked.
 * @returns {boolean} - Returns true if the commit message follows the conventional commit format, false otherwise.
 *
 * This function does the following:
 * - Constructs a regular expression using the commit types defined in the CommitTypes object.
 * - Tests the commit message against the regular expression.
 * - Returns the result of the test.
 */
function isConventionalCommit(commit) {
    const commitTypeRegex = Object.values(CommitTypes).join("|");
    const regex = new RegExp(`^(${commitTypeRegex})(!)?`);
    return regex.test(commit);
}
/**
 * Increments the version number based on the conventional commits provided.
 *
 * @param {string[]} conventionalCommits - An array of commit messages that follow the conventional commit format.
 * @param {string} version - The current version number.
 * @returns {Object} - An object containing the updated version number and the section related to the commit type.
 *
 * This function does the following:
 * - Splits the version number into an array of numbers.
 * - Iterates over the conventional commits and determines the commit type and section.
 * - If the commit type is 'feat', it increments the minor version number and resets the patch version number.
 * - If the commit type ends with '!', it increments the major version number and resets the minor and patch version numbers.
 * - If the commit type does not end with '!' and is not 'feat', it increments the patch version number.
 * - Joins the version number array back into a string.
 * - Returns the updated version number and the section related to the commit type.
 */
function incrementVersion(conventionalCommits, version) {
    let type = "";
    let section = "";
    let versionArray = version.split(".").map(Number);
    conventionalCommits.map((commit) => {
        type = commit.message.split(":")[0].trim();
        section = commitTypes.filter((commitType) => commitType.type === type)[0]
            ?.section;
    });
    const commitType = findCommitType(type);
    if (type === "feat") {
        versionArray[1]++;
        versionArray[2] = 0;
    }
    else if (commitType?.endsWith("!")) {
        versionArray[0]++;
        versionArray[1] = 0;
        versionArray[2] = 0;
    }
    else if (!commitType?.endsWith("!") &&
        type !== "feat" &&
        type !== "" &&
        type) {
        versionArray[2]++;
    }
    const currentVersion = `${versionArray.join(".")}`;
    return { currentVersion, section };
}
/**
 * Finds the commit type from the predefined commit types.
 *
 * @param {string} type - The type of the commit to be found.
 * @returns {string|undefined} - The commit type if found, undefined otherwise.
 *
 * This function does the following:
 * - Iterates over the predefined commit types.
 * - Checks if the type of each commit type matches the provided type or the provided type followed by '!'.
 * - Returns the type of the matching commit type, or undefined if no match is found.
 */
function findCommitType(type) {
    let result = commitTypes.find((item) => item.type === type + "!" || item.type === type);
    return result?.type;
}
/**
 * Removes the commit type from the commit message.
 *
 * @param {string} commitMsg - The commit message from which the commit type should be removed.
 * @returns {string} - The commit message without the commit type.
 *
 * This function does the following:
 * - Splits the commit message at the colon character.
 * - Returns the second part of the split message, which is the commit message without the commit type.
 * - If the second part of the split message is undefined, it returns an empty string.
 */
function removeType(commitMsg) {
    return commitMsg.split(":")[1]?.trim();
}
/**
 * Updates the changelog with the new version number and the processed commit messages.
 *
 * @param {string} version - The new version number to be added to the changelog.
 * @param {string[]} conventionalCommits - An array of commit messages that follow the conventional commit format.
 * @param {string} date - The date of the last commit.
 *
 * This function does the following:
 * - Checks if the CHANGELOG.md file exists in the root of the workspace.
 * - If the file does not exist, it creates a new CHANGELOG.md file with the title 'Changelog'.
 * - If the file exists but is empty, it adds the title 'Changelog' to the file.
 * - Reads the content of the CHANGELOG.md file.
 * - Splits the content of the file into an array of lines.
 * - Inserts the new version number and the date of the last commit as a new section in the changelog.
 * - Iterates over the commit types and writes the processed commit messages to the changelog.
 */
function updateChangeLog(version, conventionalCommits) {
    const workspaceFolder = vscode_1.workspace.workspaceFolders?.[0];
    const rootPath = workspaceFolder?.uri.fsPath;
    try {
        const fileExists = fs.existsSync(`${rootPath}/CHANGELOG.md`);
        if (!fileExists) {
            fs.writeFileSync(`${rootPath}/CHANGELOG.md`, `# Changelog\n\n`);
        }
        const stats = fs.statSync(`${rootPath}/CHANGELOG.md`);
        if (stats.size === 0) {
            fs.writeFileSync(`${rootPath}/CHANGELOG.md`, `# Changelog\n\n`);
        }
        const result = typeParser(conventionalCommits);
        const file = fs.readFileSync(`${rootPath}/CHANGELOG.md`, "utf-8");
        let commitDate;
        conventionalCommits.forEach((commit) => {
            commitDate = commit.date ? commit.date.toLocaleDateString() : "";
        });
        const lines = file.split("\n");
        lines.splice(2, 0, `## ${version} (${commitDate})`);
        commitTypes.map((commit) => {
            if (!commit.type.includes("!")) {
                writeToChangeLog(rootPath, result.parsedObject[commit.type].map((commit) => commit), lines, commit.section);
            }
        });
    }
    catch (error) {
        console.error("An error occurred:", error);
    }
}
/**
 * Parses the conventional commits into an object based on the commit type.
 *
 * @param {string[]} conventionalCommits - An array of commit messages that follow the conventional commit format.
 * @returns {Object} - An object containing the commit type as the key and the commit messages as the value.
 *
 * This function does the following:
 * - Initializes an object with keys for each commit type.
 * - Iterates over the conventional commits and splits the commit message at the colon character.
 * - Determines the commit type and removes the commit type from the commit message.
 * - Adds the commit message to the corresponding commit type in the object.
 */
function typeParser(conventionalCommits) {
    const parsedObject = {
        build: [],
        ci: [],
        chore: [],
        docs: [],
        fix: [],
        perf: [],
        revert: [],
        refactor: [],
        style: [],
        test: [],
        feat: [],
        breakingChanges: [],
        "build!": [],
        "ci!": [],
        "chore!": [],
        "docs!": [],
        "feat!": [],
        "fix!": [],
        "perf!": [],
        "revert!": [],
        "refactor!": [],
        "style!": [],
        "test!": [],
    };
    conventionalCommits.map((commit) => {
        const type = commit.message.split(":")[0].trim();
        if (type.includes("!")) {
            parsedObject.breakingChanges.push({
                hash: commit.hash,
                message: removeType(commit.message),
            });
            return;
        }
        parsedObject[type].push({
            hash: commit.hash,
            message: removeType(commit.message),
        });
    });
    return { parsedObject };
}
function convertSSHtoHTTPS(sshUrl, hash) {
    const regex = /git@github\.com:(.*)\.git$/;
    const match = sshUrl.match(regex);
    if (match) {
        const path = match[1];
        return `https://github.com/${path}/commit/${hash}`;
    }
    else {
        return "Invalid SSH URL";
    }
}
/**
 * Writes the processed commit messages to the changelog.
 *
 * @param {string} rootPath - The root path of the workspace.
 * @param {string[]} commits - An array of processed commit messages.
 * @param {string[]} lines - An array of lines from the changelog file.
 * @param {string} category - The category of the commit messages.
 *
 * This function does the following:
 * - Checks if there are any commits to write to the changelog.
 * - Constructs a new array of lines with the processed commit messages.
 * - Inserts the new lines into the changelog file.
 */
function writeToChangeLog(rootPath, commits, lines, category) {
    const gitExtension = vscode_1.extensions.getExtension("vscode.git").exports;
    if (!gitExtension) {
        vscode_1.window.showErrorMessage("Git extension not found");
        return;
    }
    const api = gitExtension.getAPI(1);
    const repo = api.repositories[0];
    const remote = repo.state.remotes.find((remote) => remote.name === "origin");
    if (!remote) {
        vscode.window.showErrorMessage('No remote named "origin" found.');
        return;
    }
    const remoteUrl = remote.fetchUrl || remote.pushUrl;
    if (!remoteUrl) {
        vscode.window.showErrorMessage("No remote URL found.");
        return;
    }
    if (commits.length > 0) {
        const newLines = [`### ${category}`];
        commits.forEach((commit) => {
            newLines.push(`* [${commit.hash.substring(0, 7)}](${convertSSHtoHTTPS(remoteUrl, commit.hash)}) ${commit.message}`);
        });
        lines.splice(3, 0, ...newLines);
        fs.writeFileSync(`${rootPath}/CHANGELOG.md`, lines.join("\n"));
    }
}
//# sourceMappingURL=createChangelog.js.map