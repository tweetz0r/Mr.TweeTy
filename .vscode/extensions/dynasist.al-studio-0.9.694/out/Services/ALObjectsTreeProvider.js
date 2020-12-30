"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const al_studio_1 = require("./../typings/al-studio");
//import { ALStudioPanel } from '../ALStudioPanel';
const vscode = require("vscode");
const MiddlewareService_1 = require("./MiddlewareService");
const Application_1 = require("../Application");
const VSCommandService_1 = require("./VSCommandService");
class ALStudioTreeItem extends vscode.TreeItem {
    constructor() {
        super(...arguments);
        this.type = '';
        this.app = '';
    }
}
exports.ALStudioTreeItem = ALStudioTreeItem;
class ALObjectsTreeProvider {
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
        var _a, _b;
        let main = [];
        let ctxValue = element ? element.contextValue : '';
        switch (ctxValue) {
            default:
                let paths = Application_1.Application.getWorkspacePaths();
                if (paths.length === 0) {
                    return Promise.resolve(main);
                }
                let middlewareService = Application_1.Application.container.get(MiddlewareService_1.MiddlewareService);
                return middlewareService.getProjects(paths)
                    .then(projects => {
                    for (let app of projects) {
                        main.push({ label: app.name, contextValue: 'alapp', collapsibleState: vscode.TreeItemCollapsibleState.Expanded, app: app.name });
                    }
                    return Promise.resolve(main);
                });
            case 'alapp':
                let types = [];
                let localObjects2 = (_a = Application_1.Application.objectList) === null || _a === void 0 ? void 0 : _a.filter(f => f.IsLocal === true && f.ItemType == al_studio_1.CollectorItemType.Object && f.Application == element.app);
                let objTypes = [...new Set(localObjects2.map(item => item.Type))];
                for (let type of objTypes) {
                    types.push({ label: type, contextValue: 'alobjtype', collapsibleState: vscode.TreeItemCollapsibleState.Expanded, app: element.app, type: type });
                }
                return Promise.resolve(types);
            case 'alobjtype':
                let objs = [];
                let localObjects3 = (_b = Application_1.Application.objectList) === null || _b === void 0 ? void 0 : _b.filter(f => f.IsLocal === true && f.ItemType == al_studio_1.CollectorItemType.Object && f.Application == element.app && f.Type == element.type);
                for (let obj of localObjects3) {
                    let item = {
                        label: `${obj.Name}${obj.Id ? ` (${obj.Id})` : ''}`,
                        symbolInfo: obj.SymbolData,
                        contextValue: 'openwkspceitem',
                        collapsibleState: vscode.TreeItemCollapsibleState.None
                    };
                    item.command = {
                        command: VSCommandService_1.VSCommandType.TreeShowDesigner,
                        title: '',
                        arguments: [item]
                    };
                    objs.push(item);
                }
                return Promise.resolve(objs);
        }
    }
}
exports.ALObjectsTreeProvider = ALObjectsTreeProvider;
//# sourceMappingURL=ALObjectsTreeProvider.js.map