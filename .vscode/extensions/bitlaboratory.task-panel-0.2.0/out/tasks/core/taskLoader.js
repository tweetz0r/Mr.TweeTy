"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const cp = require("child_process");
const path = require("path");
const configuration_1 = require("./configuration");
const utils_1 = require("./utils");
const configuration_2 = require("./configuration");
const nls = require("vscode-nls");
const vscode = require("vscode");
const localize = nls.loadMessageBundle();
class TaskLoaderResult {
    constructor(workspaceName, loaderKey, tasks, icons, treeCollapsibleState = configuration_2.TreeCollapsibleState.Expanded) {
        this._workspaceName = workspaceName;
        this._loaderKey = loaderKey;
        this._tasks = tasks;
        this._icons = icons;
        this._treeCollapsibleState = treeCollapsibleState;
    }
    static empty() {
        return new TaskLoaderResult("", "", []);
    }
    get workspaceName() {
        return this._workspaceName;
    }
    get icons() {
        return this._icons;
    }
    get loaderKey() {
        return this._loaderKey;
    }
    get tasks() {
        return this._tasks;
    }
    get initialTreeCollapsibleState() {
        return this._treeCollapsibleState;
    }
    isEmpty() {
        return this._workspaceName === "" || this._loaderKey === "";
    }
}
exports.TaskLoaderResult = TaskLoaderResult;
class TaskLoader {
    constructor(key, workspaceFolder, _configuration) {
        this._configuration = _configuration;
        this.BUILD_NAMES = ['build', 'compile', 'watch'];
        this.TEST_NAMES = ['test'];
        this._key = key;
        this._workspaceFolder = workspaceFolder;
        this._initialTreeState = configuration_2.TreeCollapsibleState.Expanded;
    }
    getInitialTreeState(folder) {
        return this._configuration.get(configuration_1.TasksPanelConfiguration.TREE_COLLAPSIBLE_STATE);
    }
    createFileWatchers() {
        if (this._fileWatchers) {
            this.dispose();
        }
        let watchers = [];
        let folders = this.getSearchRootPaths;
        folders.forEach((path) => {
            watchers.push(vscode.workspace.createFileSystemWatcher(this.getFilePattern(path.folderPath)));
        });
        return watchers;
    }
    filterExistingTaskFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            let allTaskFolderInfos = this.getSearchRootPaths;
            let foundWithFiles = [];
            for (let index = 0; index < allTaskFolderInfos.length; index++) {
                if (yield this.isTaskFileExists(allTaskFolderInfos[index].folderPath)) {
                    foundWithFiles.push(allTaskFolderInfos[index]);
                }
            }
            return Promise.resolve(foundWithFiles);
        });
    }
    resolveTasks(foundTaskInfos) {
        return __awaiter(this, void 0, void 0, function* () {
            let empty = TaskLoaderResult.empty();
            let results = [];
            if (foundTaskInfos.length > 0) {
                for (let index = 0; index < foundTaskInfos.length; index++) {
                    let resolvedResult = yield this.resolveByPath(foundTaskInfos[index]);
                    if (resolvedResult !== undefined) {
                        results.push(resolvedResult);
                    }
                }
                return results;
            }
            results.push(empty);
            return Promise.resolve(results);
        });
    }
    resolveTasksInternal() {
        return __awaiter(this, void 0, void 0, function* () {
            const rootPath = this.getRootPath;
            let emptyTasks = TaskLoaderResult.empty();
            if (!rootPath) {
                this.outputInfo(localize('task-panel.taskloader.rootPathIsNotSet', 'The Root path is not set.'));
                return Promise.resolve([emptyTasks]);
            }
            let foundTaskInfoWithFiles = yield this.filterExistingTaskFiles();
            if (foundTaskInfoWithFiles.length === 0) {
                this.outputInfo(localize('task-panel.taskloader.taskFileIsNotFound', utils_1.format('The {0} task definition file is not found.', this.key)));
                return Promise.resolve([emptyTasks]);
            }
            return this.resolveTasks(foundTaskInfoWithFiles);
        });
    }
    addTaskFolderInfo(coll, folderPath, displayName, isRoot) {
        return __awaiter(this, void 0, void 0, function* () {
            coll.push({
                folderPath: folderPath,
                displayName: displayName,
                isRoot: isRoot
            });
        });
    }
    prepareTaskFolderInfos() {
        let paths = [];
        if (this.getRootPath !== undefined) {
            let root = this.getRootPath;
            let condition = this._configuration.get(configuration_1.TasksPanelConfiguration.SEARCH_CONDITION);
            if (condition === configuration_2.TaskSearchConditionFlags.RootFolder || condition === configuration_2.TaskSearchConditionFlags.RootAndSubFolders) {
                try {
                    this.addTaskFolderInfo(paths, root, this._workspaceFolder.name, true);
                }
                catch (error) {
                    this.showErrorInChannel(error);
                }
            }
            if (condition === configuration_2.TaskSearchConditionFlags.RootAndSubFolders || condition === configuration_2.TaskSearchConditionFlags.SubFolders) {
                let subFolders = this._configuration.get(configuration_1.TasksPanelConfiguration.SEARCH_SUB_FOLDERS_PATH);
                if (subFolders !== null) {
                    subFolders.forEach((folder) => {
                        try {
                            this.addTaskFolderInfo(paths, path.join(root, folder), this.format("{0} [{1}]", this._workspaceFolder.name, folder), false);
                        }
                        catch (error) {
                            this.showErrorInChannel(error);
                        }
                    });
                }
            }
        }
        return paths;
    }
    get getSearchRootPaths() {
        if (this._searchRootPaths === undefined) {
            this._searchRootPaths = this.prepareTaskFolderInfos();
        }
        return this._searchRootPaths;
    }
    getTasks(reload = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._promise || reload) {
                this._initialTreeState = this.getInitialTreeState(this._workspaceFolder);
                this._promise = this.resolveTasksInternal();
            }
            return this._promise;
        });
    }
    start() {
        this._fileWatchers = this.createFileWatchers();
        this._fileWatchers.forEach((watcher) => {
            watcher.onDidChange(() => { this._promise = undefined; this._searchRootPaths = undefined; });
            watcher.onDidCreate(() => { this._promise = undefined; this._searchRootPaths = undefined; });
            watcher.onDidDelete(() => { this._promise = undefined; this._searchRootPaths = undefined; });
        });
    }
    isBuildTask(name) {
        for (let buildName of this.BUILD_NAMES) {
            if (name.indexOf(buildName) !== -1) {
                return true;
            }
        }
        return false;
    }
    isTestTask(name) {
        for (let testName of this.TEST_NAMES) {
            if (name.indexOf(testName) !== -1) {
                return true;
            }
        }
        return false;
    }
    dispose() {
        this._promise = undefined;
        this._searchRootPaths = undefined;
        if (this._fileWatchers) {
            this._fileWatchers.forEach((watcher) => {
                watcher.dispose();
            });
        }
    }
    sortTasksAsc(tasks) {
        return tasks.sort((a, b) => {
            return a.name < b.name ? -1 : 1;
        });
    }
    format(message, ...args) {
        return utils_1.format(message, ...args);
    }
    exists(file) {
        return new Promise((resolve, _reject) => {
            fs.exists(file, (value) => {
                resolve(value);
            });
        });
    }
    exec(command, options) {
        return new Promise((resolve, reject) => {
            cp.exec(command, options, (error, stdout, stderr) => {
                if (error) {
                    reject({ error, stdout, stderr });
                    return;
                }
                resolve({ stdout, stderr });
            });
        });
    }
    getOutputDisplayName(taskFolderInfo) {
        if (taskFolderInfo) {
            return taskFolderInfo.displayName;
        }
        return this.getWorkspaceFolder.name;
    }
    outputInfo(message, taskFolderInfo) {
        utils_1.output(this.format(`[Info] ({0}: {1}) {2}`, this.getOutputDisplayName(taskFolderInfo), this._key, message));
    }
    outputError(message, taskFolderInfo) {
        utils_1.output(this.format(`[Error] ({0}: {1}) {2}`, this.getOutputDisplayName(taskFolderInfo), this._key, message));
    }
    showErrorInChannel(error) {
        let channel = utils_1.getOrCreateOutputChannel();
        if (error.stderr) {
            channel.appendLine(error.stderr);
        }
        if (error.stdout) {
            channel.appendLine(error.stdout);
        }
        if (typeof error === "object" && error instanceof Array) {
            error.forEach((line) => {
                channel.appendLine(line);
            });
        }
        if (typeof error === "string") {
            channel.appendLine(error);
        }
        channel.appendLine(this.format('Task load for folder {0} failed with error: {1}', this.getWorkspaceFolder.name, error.error ? error.error.toString() : 'unknown'));
        channel.show(true);
    }
    setTaskGroup(name, task) {
        let lowerCaseTaskName = name.toLowerCase();
        if (this.isBuildTask(lowerCaseTaskName)) {
            task.group = vscode.TaskGroup.Build;
        }
        else if (this.isTestTask(lowerCaseTaskName)) {
            task.group = vscode.TaskGroup.Test;
        }
    }
    getTaskIcons(iconFileName) {
        return {
            light: utils_1.getIconPath(utils_1.IconTheme.Light, iconFileName),
            dark: utils_1.getIconPath(utils_1.IconTheme.Dark, iconFileName)
        };
    }
    get getRootPath() {
        return this._workspaceFolder.uri.scheme === 'file' ? this._workspaceFolder.uri.fsPath : undefined;
    }
    get getWorkspaceFolder() {
        return this._workspaceFolder;
    }
    get key() {
        return this._key;
    }
    get initialTreeCollapsibleState() {
        return this._initialTreeState;
    }
    get configuration() {
        return this._configuration;
    }
}
exports.TaskLoader = TaskLoader;
//# sourceMappingURL=taskLoader.js.map