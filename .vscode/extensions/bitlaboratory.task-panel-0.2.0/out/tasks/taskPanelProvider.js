"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const taskPanelItem_1 = require("./core/taskPanelItem");
const vscode = require("vscode");
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle();
class TaskPanelProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this._tasks = [];
        this._initialized = false;
        this._rootTreeList = [];
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        let list = [];
        if (this._rootTreeList.length > 0) {
            if (!element) {
                return Promise.resolve(this._rootTreeList);
            }
            return Promise.resolve(element.getChildren());
        }
        if (this._tasks.length === 0) {
            if (this._initialized) {
                vscode.window.showInformationMessage(localize("task-panel.taskpanelprovider.taskNotFound", "Tasks are not found."));
            }
            return Promise.resolve(list);
        }
        return new Promise(resolve => {
            this._tasks.forEach((resultItem) => {
                if (!resultItem.isEmpty()) {
                    let root = new taskPanelItem_1.TaskPanelRootItem(resultItem.workspaceName + ": " + resultItem.loaderKey, resultItem.initialTreeCollapsibleState, resultItem.icons);
                    this._rootTreeList.push(root);
                    resultItem.tasks.forEach((item) => {
                        root.addChild(new taskPanelItem_1.TaskPanelItem(item.name, item));
                    });
                }
            });
            resolve(this._rootTreeList);
        });
    }
    updateState() {
        this._onDidChangeTreeData.fire();
    }
    clean() {
        this._rootTreeList = [];
        this._tasks = [];
        this._initialized = false;
        this._onDidChangeTreeData.fire();
    }
    refresh(tasks) {
        this._rootTreeList = [];
        this._tasks = tasks;
        this._initialized = true;
        this._onDidChangeTreeData.fire();
    }
}
exports.TaskPanelProvider = TaskPanelProvider;
//# sourceMappingURL=taskPanelProvider.js.map