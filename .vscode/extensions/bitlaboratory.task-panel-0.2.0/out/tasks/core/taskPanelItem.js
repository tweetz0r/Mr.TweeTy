"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const configuration_1 = require("./configuration");
const vscode = require("vscode");
let itemIcons = {
    defaultIcon: {
        light: utils_1.getIconPath(utils_1.IconTheme.Light, 'bullet'),
        dark: utils_1.getIconPath(utils_1.IconTheme.Dark, 'bullet')
    },
    selectedIcon: {
        light: utils_1.getIconPath(utils_1.IconTheme.Light, 'bullet_selected'),
        dark: utils_1.getIconPath(utils_1.IconTheme.Dark, 'bullet_selected')
    },
    runningIcon: {
        light: utils_1.getIconPath(utils_1.IconTheme.Light, 'bullet_running'),
        dark: utils_1.getIconPath(utils_1.IconTheme.Dark, 'bullet_running')
    }
};
class TaskPanelItemBase extends vscode.TreeItem {
    constructor(name, isFolderNode, command) {
        super(name);
        this._isFolderNode = false;
        this._isFolderNode = isFolderNode;
        this.command = command;
        this._id = utils_1.newGuid();
    }
    get id() {
        return this._id;
    }
    get tooltip() {
        return this.label ? this.label : "";
    }
    get isFolderNode() {
        return this._isFolderNode;
    }
}
exports.TaskPanelItemBase = TaskPanelItemBase;
class TaskPanelRootItem extends TaskPanelItemBase {
    constructor(name, initialTreeState, icons) {
        super(name, true);
        this._children = [];
        this.contextValue = "root";
        this.collapsibleState = initialTreeState === configuration_1.TreeCollapsibleState.Expanded
            ? vscode.TreeItemCollapsibleState.Expanded
            : vscode.TreeItemCollapsibleState.Collapsed;
        this.iconPath = icons;
    }
    addChild(child) {
        this._children.push(child);
    }
    getChildren() {
        return this._children;
    }
}
exports.TaskPanelRootItem = TaskPanelRootItem;
class TaskPanelItem extends TaskPanelItemBase {
    constructor(name, task, command) {
        super(name, !task);
        this._isSelected = false;
        this._isRunning = false;
        this.command = TaskPanelItem.getOnSelectCommand(this);
        this.contextValue = "item";
        this._task = task;
        this._defaultIcon = itemIcons.defaultIcon;
        this.iconPath = this._defaultIcon;
    }
    static getOnSelectCommand(taskItem) {
        return {
            title: 'Select Node',
            command: 'bitlab-vscode.taskpanel.onNodeSelect',
            arguments: [taskItem]
        };
    }
    selected(selected) {
        this._isSelected = selected;
        if (!this._isRunning) {
            if (this._isSelected) {
                this.iconPath = itemIcons.selectedIcon;
            }
            else {
                this.iconPath = this._defaultIcon;
            }
        }
    }
    running(running) {
        this._isRunning = running;
        if (this._isRunning) {
            this.iconPath = itemIcons.runningIcon;
        }
        else if (this._isSelected) {
            this.iconPath = itemIcons.selectedIcon;
        }
        else {
            this.iconPath = this._defaultIcon;
        }
    }
    get isRunning() {
        return this._isRunning;
    }
    get tooltip() {
        return this._task ? `${this._task.source}: ${this._task.name}` : super.tooltip;
    }
    get task() {
        return this._task;
    }
}
exports.TaskPanelItem = TaskPanelItem;
//# sourceMappingURL=taskPanelItem.js.map