"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configuration_1 = require("./core/configuration");
const gruntTaskLoader_1 = require("./gruntTaskLoader");
const gulpTaskLoader_1 = require("./gulpTaskLoader");
const taskManager_1 = require("./taskManager");
const vscode = require("vscode");
class DoubleClick {
    constructor(doubleClickTimeout) {
        this._clickCount = 0;
        this._currentSelectedId = null;
        this._doubleClickTimeout = doubleClickTimeout;
    }
    clearCountValues() {
        this._currentSelectedId = null;
        this._clickCount = 0;
    }
    reInitCounting(id) {
        clearTimeout(this._doubleClickResetTimerId);
        this._currentSelectedId = id;
        this._clickCount = 1;
        this._doubleClickResetTimerId = setTimeout(() => {
            this.clearCountValues();
        }, this._doubleClickTimeout);
    }
    isDoubleClick(id) {
        let doubleClick = false;
        if (this._currentSelectedId !== id) {
            this.reInitCounting(id);
            return doubleClick;
        }
        else {
            this._clickCount++;
        }
        doubleClick = this._clickCount >= 2;
        if (doubleClick) {
            clearTimeout(this._doubleClickResetTimerId);
            this.clearCountValues();
        }
        return doubleClick;
    }
}
exports.DoubleClick = DoubleClick;
class TaskExtension {
    constructor(_context) {
        this._context = _context;
        this._doubleClickChecker = new DoubleClick(500);
        this.registerCommands();
        this._taskPanelConfiguration = new configuration_1.TasksPanelConfiguration();
        this._taskManager = new taskManager_1.TaskManager(this._context, this._taskPanelConfiguration);
        this.registerTasks();
    }
    registerTasks() {
        if (this._taskPanelConfiguration.get(configuration_1.TasksPanelConfiguration.SEARCH_GRUNT_TASKS)) {
            this._taskManager.registerTaskLoader("grunt", gruntTaskLoader_1.GruntTaskLoader);
        }
        if (this._taskPanelConfiguration.get(configuration_1.TasksPanelConfiguration.SEARCH_GULP_TASKS)) {
            this._taskManager.registerTaskLoader("gulp", gulpTaskLoader_1.GulpTaskLoader);
        }
    }
    addForDispose(disposable) {
        this._context.subscriptions.push(disposable);
    }
    registerCommands() {
        this.addForDispose(vscode.commands.registerCommand('bitlab-vscode.taskpanel.refresh', () => {
            this.refresh();
        }));
        this.addForDispose(vscode.commands.registerCommand('bitlab-vscode.taskpanel.execute', (taskItem) => {
            this.execute(taskItem);
        }));
        this.addForDispose(vscode.commands.registerCommand('bitlab-vscode.taskpanel.terminate', (taskItem) => {
            this.terminate(taskItem);
        }));
        this.addForDispose(vscode.commands.registerCommand('bitlab-vscode.taskpanel.restart', (taskItem) => {
            this.restart(taskItem);
        }));
        this.addForDispose(vscode.commands.registerCommand('bitlab-vscode.taskpanel.onNodeSelect', (taskItem) => {
            if (this._doubleClickChecker.isDoubleClick(taskItem.id)) {
                this.execute(taskItem);
            }
            else {
                this.onNodeSelect(taskItem);
            }
        }));
    }
    onNodeSelect(taskItem) {
        this._taskManager.selectTask(taskItem);
    }
    start() {
        this._taskManager.start();
    }
    reStart() {
        this._taskManager.reStart(() => {
            this.registerTasks();
        });
    }
    execute(taskItem) {
        this._taskManager.executeTask(taskItem);
    }
    terminate(taskItem) {
        this._taskManager.terminateTask(taskItem);
    }
    restart(taskItem) {
        this._taskManager.restartTask(taskItem);
    }
    refresh() {
        if (this._taskPanelConfiguration.isConfigChanged) {
            this.reStart();
        }
        else {
            this._taskManager.refresh();
        }
    }
    dispose() {
        if (this._taskManager) {
            this._taskManager.dispose();
        }
        if (this._taskPanelConfiguration) {
            this._taskPanelConfiguration.dispose();
        }
    }
}
exports.TaskExtension = TaskExtension;
//# sourceMappingURL=taskExtension.js.map