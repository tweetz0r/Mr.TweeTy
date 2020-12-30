"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const al_studio_1 = require("../typings/al-studio");
const ALScopeService_1 = require("./ALScopeService");
const Application_1 = require("./../Application");
const vscode = require("vscode");
const VSCommandService_1 = require("./VSCommandService");
class ALStudioScopeItem extends vscode.TreeItem {
    constructor() {
        super(...arguments);
        this.taskId = '';
        this.app = '';
        this.level = 0;
    }
}
exports.ALStudioScopeItem = ALStudioScopeItem;
class ALScopeProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.alScopeService = Application_1.Application.container.get(ALScopeService_1.ALScopeService);
    }
    refresh() {
        this.alScopeService.init();
        this._onDidChangeTreeData.fire(undefined);
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        let main = [];
        if (element) {
            let scope = this.alScopeService.getScope(element.app);
            switch (element.contextValue) {
                case 'alscope':
                    if (scope.Objects.length === 0) {
                        return Promise.resolve(main);
                    }
                    let objs = scope.Objects.map(m => {
                        let name = m.IsEvent === true ? `${m.EventName} (${al_studio_1.ALObjectType[m.Type]} ${m.Name})` : `${al_studio_1.ALObjectType[m.Type]} ${m.Name}`;
                        let item = new ALStudioScopeItem(name, vscode.TreeItemCollapsibleState.None);
                        item.contextValue = 'alstudioscopeitem';
                        item.command = {
                            command: VSCommandService_1.VSCommandType.ScopeTreeShowDesigner,
                            title: '',
                            arguments: [m]
                        };
                        item.level = 1;
                        item.app = element.app;
                        item.scopeItem = m;
                        return item;
                    });
                    return Promise.resolve(objs);
            }
            return Promise.resolve(main);
        }
        else {
            for (let scope of this.alScopeService.scopes) {
                main.push({ label: `${scope.Name}${scope.TaskID ? ` (${scope.TaskID})` : ''}`, level: 0, app: scope.Name, contextValue: 'alscope', collapsibleState: vscode.TreeItemCollapsibleState.Expanded });
            }
            return Promise.resolve(main);
        }
    }
}
exports.ALScopeProvider = ALScopeProvider;
//# sourceMappingURL=ALScopeProvider.js.map