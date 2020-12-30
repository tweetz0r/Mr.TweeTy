"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const taskPanelItem_1 = require("./core/taskPanelItem");
const taskPanelProvider_1 = require("./taskPanelProvider");
const taskRuner_1 = require("./core/taskRuner");
const utils_1 = require("./core/utils");
const vscode = require("vscode");
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle();
function resolveTasks(taskLoaders, reload = false) {
    if (taskLoaders.size === 0) {
        return Promise.resolve([]);
    }
    else if (taskLoaders.size === 1) {
        return Promise.resolve(taskLoaders.values().next().value.getTasks(reload));
    }
    else {
        let promises = [];
        for (let loader of taskLoaders.values()) {
            promises.push(loader.getTasks(reload).then((value) => value, () => []));
        }
        return Promise.all(promises).then((values) => {
            let result = [];
            for (let tasks of values) {
                if (tasks && tasks.length > 0) {
                    result.push(...tasks);
                }
            }
            return result;
        });
    }
}
class TaskDetector {
    constructor(taskLoaders) {
        this._taskLoaders = taskLoaders;
    }
    start() {
        for (let item of this._taskLoaders.values()) {
            item.start();
        }
    }
    getTasks(reload = false) {
        return this.resolveTasks(reload);
    }
    resolveTasks(reload) {
        return resolveTasks(this._taskLoaders, reload);
    }
    dispose() {
        this._taskLoaders.forEach((item) => {
            item.dispose();
        });
        this._taskLoaders.clear();
    }
}
class TaskManager {
    constructor(_context, _taskPanelConfiguration) {
        this._context = _context;
        this._taskPanelConfiguration = _taskPanelConfiguration;
        this._detectors = new Map();
        this._loaders = new Map();
        this._taskPanelProvider = new taskPanelProvider_1.TaskPanelProvider();
        this._taskRunner = new taskRuner_1.TaskRunner();
        this.registerTaskRunnerEvents();
        this.registerTreeProvider();
    }
    registerTaskRunnerEvents() {
        this._taskRunner.onDidTaskStateChanged((e) => {
            if (e && e.state === taskRuner_1.TaskState.TaskRun) {
                e.task.running(true);
            }
            else if (e) {
                e.task.running(false);
            }
            this._taskPanelProvider.updateState();
        });
    }
    registerTreeProvider() {
        this._context.subscriptions.push(vscode.window.registerTreeDataProvider('bitlab-vscode.taskpanel', this._taskPanelProvider));
    }
    registerTaskLoader(key, loader) {
        this._loaders.set(key, loader);
    }
    cleanObject() {
        this.cleanSelection();
        this._taskRunner.reset();
        this._taskPanelProvider.clean();
        this._loaders.clear();
        this._detectors.forEach((item) => {
            item.dispose();
        });
        this._detectors.clear();
    }
    unregisterAllTaskLoader() {
        this.cleanObject();
        this._loaders.clear();
    }
    create(ctor, ...args) {
        let obj = new ctor(...args);
        return obj;
    }
    createTaskLoaders(workspaceFolder) {
        let loaders = new Map();
        for (let forCreate of this._loaders.values()) {
            let instance = this.create.apply(null, [forCreate, workspaceFolder, this._taskPanelConfiguration]);
            loaders.set(instance.key, instance);
        }
        return loaders;
    }
    update(reload = false) {
        if (this._loaders.size === 0) {
            utils_1.output(localize("task-panel.taskExtension.nothingSelectedInConfiguration", "All Task Loaders are disabled!"), "Warning");
            return;
        }
        utils_1.output(localize("task-panel.taskManager.discoveringTaskFile", "Discovering task file ..."));
        if (this._detectors.size > 0) {
            resolveTasks(this._detectors, reload).then((value) => {
                this._taskPanelProvider.refresh(value);
            })
                .catch((reason) => {
                this._taskPanelProvider.refresh([]);
                utils_1.output(localize("task-panel.taskManager.cannotResolveTasks", utils_1.format("Tasks cannot be resolved (Reason: {0})!", reason.toString())), "Error");
            });
        }
        else if (this._detectors.size === 0) {
            utils_1.output(localize("task-panel.taskManager.taskFileNotFound", "Task file is not found."), "Warning");
            this._taskPanelProvider.refresh([]);
        }
    }
    updateWorkspaceFolders(added, removed) {
        for (let remove of removed) {
            let detector = this._detectors.get(remove.uri.toString());
            if (detector) {
                detector.dispose();
                this._detectors.delete(remove.uri.toString());
            }
        }
        for (let add of added) {
            let detector = new TaskDetector(this.createTaskLoaders(add));
            this._detectors.set(add.uri.toString(), detector);
            detector.start();
        }
        this.update();
    }
    updateFolders() {
        let folders = vscode.workspace.workspaceFolders;
        if (folders) {
            this.updateWorkspaceFolders(folders, []);
        }
    }
    reStart(registerTaskLoaders) {
        this.cleanObject();
        registerTaskLoaders();
        this.updateFolders();
    }
    start() {
        this.updateFolders();
        this._context.subscriptions.push(vscode.workspace.onDidChangeWorkspaceFolders((event) => this.updateWorkspaceFolders(event.added, event.removed)));
    }
    selectCurrentTask() {
        if (this._selectedTaskItem) {
            this._selectedTaskItem.selected(true);
        }
    }
    showErrorTaskNotSelected() {
        vscode.window.showErrorMessage(localize("task-panel.taskManager.taskNotSelected", "Task is not selected!"));
    }
    runOnSelectedTask(taskItem, callback) {
        if (taskItem !== undefined && taskItem instanceof taskPanelItem_1.TaskPanelItem) {
            callback(taskItem);
        }
        else if (this._selectedTaskItem !== undefined) {
            callback(this._selectedTaskItem);
        }
        else {
            this.showErrorTaskNotSelected();
        }
    }
    runSelectedTask() {
        if (this._selectedTaskItem) {
            this.selectCurrentTask();
            this._taskRunner.execute(this._selectedTaskItem);
            this._taskPanelProvider.updateState();
        }
        else {
            this.showErrorTaskNotSelected();
        }
    }
    executeTask(taskItem) {
        if (taskItem !== undefined && taskItem instanceof taskPanelItem_1.TaskPanelItem) {
            this.cleanSelection();
            this._selectedTaskItem = taskItem;
            this.runSelectedTask();
        }
        else if (this._selectedTaskItem !== undefined) {
            this.runSelectedTask();
        }
        else {
            this._selectedTaskItem = undefined;
            this.showErrorTaskNotSelected();
        }
        this._taskPanelProvider.updateState();
    }
    terminateTask(taskItem) {
        this.runOnSelectedTask(taskItem, (task) => {
            this._taskRunner.terminateProcess(task);
        });
    }
    restartTask(taskItem) {
        this.runOnSelectedTask(taskItem, (task) => {
            this._taskRunner.restartProcess(task);
        });
    }
    deselectCurrentTask() {
        if (this._selectedTaskItem) {
            this._selectedTaskItem.selected(false);
        }
    }
    cleanSelection() {
        this.deselectCurrentTask();
        this._selectedTaskItem = undefined;
    }
    selectTask(taskItem) {
        if (taskItem instanceof taskPanelItem_1.TaskPanelItem) {
            this.deselectCurrentTask();
            this._selectedTaskItem = taskItem;
            taskItem.selected(true);
        }
        else {
            this.cleanSelection();
        }
        this._taskPanelProvider.updateState();
    }
    refresh() {
        this.cleanSelection();
        this._taskRunner.reset();
        this._taskPanelProvider.clean();
        this.update(true);
    }
    dispose() {
        this.cleanObject();
    }
}
exports.TaskManager = TaskManager;
//# sourceMappingURL=taskManager.js.map