"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ALStudioPanel_1 = require("../ALStudioPanel");
const vscode = require("vscode");
const VSCommandService_1 = require("./VSCommandService");
class ALStudioOpenItem extends vscode.TreeItem {
    constructor() {
        super(...arguments);
        this.type = '';
        this.app = '';
    }
}
exports.ALStudioOpenItem = ALStudioOpenItem;
class ALOpenEditorsProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    refresh() {
        this._onDidChangeTreeData.fire(undefined);
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        let main = [];
        if (!element) {
            if (!ALStudioPanel_1.ALStudioPanel.instances) {
                return Promise.resolve(main);
            }
            let panels = ALStudioPanel_1.ALStudioPanel.instances.map(m => {
                let item = new ALStudioOpenItem(m.title, vscode.TreeItemCollapsibleState.None);
                item.contextValue = 'opentreeitem';
                item.command = {
                    command: VSCommandService_1.VSCommandType.OpenTreeShowEntry,
                    title: '',
                    arguments: [item]
                };
                return item;
            });
            return Promise.resolve(panels);
        }
        else {
            return Promise.resolve(main);
        }
    }
}
exports.ALOpenEditorsProvider = ALOpenEditorsProvider;
//# sourceMappingURL=ALOpenEditorsProvider.js.map