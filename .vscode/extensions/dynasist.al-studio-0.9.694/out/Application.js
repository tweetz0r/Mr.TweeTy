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
const SymbolReferenceProvider_1 = require("./Services/SymbolReferenceProvider");
const EventPublisherDefinitionProvider_1 = require("./Services/EventPublisherDefinitionProvider");
const ALStudioFeature_1 = require("./ALStudioFeature");
const ALScopeProvider_1 = require("./Services/ALScopeProvider");
const aurelia_dependency_injection_1 = require("aurelia-dependency-injection");
const LogService_1 = require("./Services/LogService");
const MiddlewareService_1 = require("./Services/MiddlewareService");
const BackendService_1 = require("./Services/BackendService");
const VSCommandService_1 = require("./Services/VSCommandService");
const UIService_1 = require("./Services/UIService");
const vscode_1 = require("vscode");
const fs_extra_1 = require("fs-extra");
const ALStudioPanel_1 = require("./ALStudioPanel");
const ALObjectsTreeProvider_1 = require("./Services/ALObjectsTreeProvider");
const DalDocumentProvider_1 = require("./Services/DalDocumentProvider");
const path_1 = require("path");
//import { DalDefinitionProvider } from './Services/DalDefinitionProvider';
const ExternalAPIService_1 = require("./Services/ExternalAPIService");
const packageConfig = require('../package.json');
const ALStudioUriHandler_1 = require("./Services/ALStudioUriHandler");
//import { DalDefinitionProvider } from './Services/DalDefinitionProvider';
class Application {
    constructor() {
        this._activeProject = '';
        this._watchers = [];
        this._designerEmittedChange = false;
        this._discoverInProgress = false;
        this._objectList = [];
        this._dashboardList = null;
        this._initialDiscoveryFinished = false;
        this._dirtyCache = false;
        this._extensionName = `${packageConfig.publisher}.${packageConfig.name}`;
        this._displayName = packageConfig.displayName;
        this._debugMode = packageConfig.debugMode === true;
        this._container = (new aurelia_dependency_injection_1.Container()).makeGlobal();
        this._logService = this._container.get(LogService_1.LogService);
        this._uiService = this._container.get(UIService_1.UIService);
        this._backendService = this._container.get(BackendService_1.BackendService);
        this._middlewareService = this._container.get(MiddlewareService_1.MiddlewareService);
        this._outputChannel = vscode_1.window.createOutputChannel(this._displayName);
    }
    static get container() {
        return Application._instance._container;
    }
    static get debugMode() {
        return Application._instance._debugMode;
    }
    static get displayName() {
        return Application._instance._displayName;
    }
    static get extensionName() {
        return Application._instance._extensionName;
    }
    static get config() {
        let config = Application.clone(vscode_1.workspace.getConfiguration('alStudio'));
        return config;
    }
    static get instance() {
        if (!Application._instance) {
            Application._instance = new Application();
        }
        return Application._instance;
    }
    static get context() {
        return Application.instance._context;
    }
    static set context(_context) {
        Application.instance._context = _context;
    }
    static get objectList() {
        return Application.instance._objectList;
    }
    static set objectList(_objectList) {
        Application.instance._objectList = _objectList;
    }
    static get dashboardList() {
        return Application.instance._dashboardList;
    }
    static set dashboardList(_dashboardList) {
        Application.instance._dashboardList = _dashboardList;
    }
    static get log() {
        return Application._instance._logService;
    }
    static get ui() {
        return Application._instance._uiService;
    }
    static get outputChannel() {
        return Application._instance._outputChannel;
    }
    static get designerEmittedChange() {
        return Application._instance._designerEmittedChange;
    }
    static set designerEmittedChange(newValue) {
        Application._instance._designerEmittedChange = newValue;
    }
    static get discoverInProgress() {
        return Application.instance._discoverInProgress;
    }
    static set discoverInProgress(newValue) {
        Application.instance._discoverInProgress = newValue;
    }
    static get initialDiscoveryFinished() {
        return Application.instance._initialDiscoveryFinished;
    }
    static set initialDiscoveryFinished(newValue) {
        Application.instance._initialDiscoveryFinished = newValue;
    }
    static get activeProject() {
        return Application.instance._activeProject;
    }
    static set activeProject(newValue) {
        Application.instance._activeProject = newValue;
    }
    static get dirtyCache() {
        return Application.instance._dirtyCache;
    }
    static set dirtyCache(newValue) {
        Application.instance._dirtyCache = newValue;
    }
    static activate() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Application.instance._activate();
        });
    }
    static deactivate() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Application.instance._deactivate();
        });
    }
    static checkExtension(name) {
        let checkExt = vscode_1.extensions.getExtension(name);
        return checkExt ? true : false;
    }
    registerCommand(name, commandFunc) {
        this._context.subscriptions.push(vscode_1.commands.registerCommand(name, commandFunc));
    }
    registerCommands() {
        this.registerCommand(VSCommandService_1.VSCommandType.Dashboard, VSCommandService_1.VSCommandService.dashboard);
        this.registerCommand(VSCommandService_1.VSCommandType.Docs, VSCommandService_1.VSCommandService.docs);
        this.registerCommand(VSCommandService_1.VSCommandType.TranslationManager, VSCommandService_1.VSCommandService.translations);
        this.registerCommand(VSCommandService_1.VSCommandType.CreateWorkspace, VSCommandService_1.VSCommandService.createWorkspace);
        this.registerCommand(VSCommandService_1.VSCommandType.About, VSCommandService_1.VSCommandService.about);
        this.registerCommand(VSCommandService_1.VSCommandType.Activate, VSCommandService_1.VSCommandService.activate);
        this.registerCommand(VSCommandService_1.VSCommandType.Discover, VSCommandService_1.VSCommandService.discover);
        this.registerCommand(VSCommandService_1.VSCommandType.Search, VSCommandService_1.VSCommandService.search);
        this.registerCommand(VSCommandService_1.VSCommandType.Snapshots, VSCommandService_1.VSCommandService.snapshots);
        this.registerCommand(VSCommandService_1.VSCommandType.ObjectDesigner, VSCommandService_1.VSCommandService.dashboard);
        this.registerCommand(VSCommandService_1.VSCommandType.OpenDesigner, VSCommandService_1.VSCommandService.openDesigner);
        this.registerCommand(VSCommandService_1.VSCommandType.TableDesigner, VSCommandService_1.VSCommandService.tableDesigner);
        this.registerCommand(VSCommandService_1.VSCommandType.TableFields, VSCommandService_1.VSCommandService.tableFields);
        this.registerCommand(VSCommandService_1.VSCommandType.PageDesigner, VSCommandService_1.VSCommandService.pageDesigner);
        this.registerCommand(VSCommandService_1.VSCommandType.PagePreview, VSCommandService_1.VSCommandService.pagePreview);
        this.registerCommand(VSCommandService_1.VSCommandType.EnumDesigner, VSCommandService_1.VSCommandService.enumDesigner);
        this.registerCommand(VSCommandService_1.VSCommandType.TreeAbout, VSCommandService_1.VSCommandService.about);
        this.registerCommand(VSCommandService_1.VSCommandType.TreeActivate, VSCommandService_1.VSCommandService.activate);
        this.registerCommand(VSCommandService_1.VSCommandType.TreeCreateWorkspace, VSCommandService_1.VSCommandService.createWorkspace);
        this.registerCommand(VSCommandService_1.VSCommandType.OpenTreeCloseEntry, VSCommandService_1.VSCommandService.closeEntry);
        this.registerCommand(VSCommandService_1.VSCommandType.TreeNewPage, VSCommandService_1.VSCommandService.newPage);
        this.registerCommand(VSCommandService_1.VSCommandType.TreeRefreshEntry, () => this._alObjectsTreeProvider.refresh());
        //this.registerCommand(VSCommandType.OpenTreeRefreshEntry, () => this._alOpenEditorsProvider.refresh());
        this.registerCommand(VSCommandService_1.VSCommandType.ScopeTreeRefreshEntry, () => this._alScopeProvider.refresh());
        this.registerCommand(VSCommandService_1.VSCommandType.TreeShowDesigner, VSCommandService_1.VSCommandService.showDesigner);
        this.registerCommand(VSCommandService_1.VSCommandType.ScopeTreeShowDesigner, VSCommandService_1.VSCommandService.showDesignerFromScope);
        this.registerCommand(VSCommandService_1.VSCommandType.TreeShowEntry, VSCommandService_1.VSCommandService.showEntry);
        this.registerCommand(VSCommandService_1.VSCommandType.OpenTreeShowEntry, VSCommandService_1.VSCommandService.showEntry);
        this.registerCommand(VSCommandService_1.VSCommandType.TreeShowObjects, VSCommandService_1.VSCommandService.dashboard);
        this.registerCommand(VSCommandService_1.VSCommandType.ScopeCreateEntry, VSCommandService_1.VSCommandService.addScope);
        this.registerCommand(VSCommandService_1.VSCommandType.GenerateProjectDocs, VSCommandService_1.VSCommandService.generateProjectDocs);
        this.registerCommand(VSCommandService_1.VSCommandType.TreeGenerateProjectDocs, VSCommandService_1.VSCommandService.generateProjectDocs);
        this.registerCommand(VSCommandService_1.VSCommandType.ScopeTreeRemoveScope, VSCommandService_1.VSCommandService.removeScope);
        this.registerCommand(VSCommandService_1.VSCommandType.ScopeTreeRemoveScopeEntry, VSCommandService_1.VSCommandService.removeFromScope);
    }
    registerWatchers() {
        let watcher = vscode_1.workspace.createFileSystemWatcher('**/*.al');
        this._context.subscriptions.push(watcher.onDidCreate((e) => VSCommandService_1.VSCommandService.localObjectWatcher(e.fsPath, 'add')));
        this._context.subscriptions.push(watcher.onDidChange((e) => VSCommandService_1.VSCommandService.localObjectWatcher(e.fsPath, 'change')));
        this._context.subscriptions.push(watcher.onDidDelete((e) => VSCommandService_1.VSCommandService.localObjectWatcher(e.fsPath, 'unlink')));
        let watcher2 = vscode_1.workspace.createFileSystemWatcher('**/alstudio.scopes.json');
        this._context.subscriptions.push(watcher2.onDidCreate(VSCommandService_1.VSCommandService.scopeFileWatcher));
        this._context.subscriptions.push(watcher2.onDidChange(VSCommandService_1.VSCommandService.scopeFileWatcher));
        this._context.subscriptions.push(watcher2.onDidDelete(VSCommandService_1.VSCommandService.scopeFileWatcher));
        let watcher3 = vscode_1.workspace.createFileSystemWatcher('**/*alpackages/*.app');
        this._context.subscriptions.push(watcher3.onDidCreate(VSCommandService_1.VSCommandService.symbolPackageWatcher));
        this._context.subscriptions.push(watcher3.onDidChange(VSCommandService_1.VSCommandService.symbolPackageWatcher));
        this._context.subscriptions.push(watcher3.onDidDelete(VSCommandService_1.VSCommandService.symbolPackageWatcher));
        // Workspace watcher
        this._context.subscriptions.push(vscode_1.workspace.onDidChangeWorkspaceFolders(() => __awaiter(this, void 0, void 0, function* () {
            yield VSCommandService_1.VSCommandService.executeCommand(VSCommandService_1.VSCommandType.Discover);
        })));
    }
    registerBackend() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._outputChannel) {
                this._outputChannel = vscode_1.window.createOutputChannel(this._displayName);
            }
            yield this._backendService.start(this._context.extensionPath);
            if (this._backendService.process) {
                this._backendService.process.stdout.on('data', (data) => {
                    let line = data.toString();
                    Application.log.output(line);
                });
            }
            yield this._middlewareService.init(`http://localhost:${this._backendService.port}`);
        });
    }
    registerProviders() {
        // TreeView
        this._alObjectsTreeProvider = new ALObjectsTreeProvider_1.ALObjectsTreeProvider();
        //this._alOpenEditorsProvider = new ALOpenEditorsProvider();
        this._alScopeProvider = new ALScopeProvider_1.ALScopeProvider();
        this._context.subscriptions.push(vscode_1.window.registerTreeDataProvider('alStudioALObjectsTreeProvider', this._alObjectsTreeProvider));
        //this._context.subscriptions.push(window.registerTreeDataProvider('alStudioOpenEditorsProvider', this._alOpenEditorsProvider));
        this._context.subscriptions.push(vscode_1.window.registerTreeDataProvider('alStudioScopeProvider', this._alScopeProvider));
        let alWebViewProvider = new ALStudioPanel_1.ALStudioPanel(ALStudioFeature_1.ALStudioFeature.SideBarDashboard, { title: 'Overview' });
        ALStudioPanel_1.ALStudioPanel.instances.push(alWebViewProvider);
        this._context.subscriptions.push(vscode_1.window.registerWebviewViewProvider('alStudioWebView', alWebViewProvider));
        // Custom AL Symbol view
        let docProvider = new DalDocumentProvider_1.DalDocumentProvider();
        this._context.subscriptions.push(vscode_1.workspace.registerTextDocumentContentProvider('al-studio-preview', docProvider));
        /*this._context.subscriptions.push(languages.registerDefinitionProvider({ scheme: 'al-studio-preview' }, new DalDefinitionProvider()));
        this._context.subscriptions.push(languages.registerDefinitionProvider({ scheme: 'al-preview' }, new DalDefinitionProvider()));
        this._context.subscriptions.push(languages.registerDefinitionProvider({ language: 'al' }, new DalDefinitionProvider()));*/
        //this._context.subscriptions.push(languages.registerDefinitionProvider({ scheme: 'al-studio-preview' }, new EventPublisherDefinitionProvider()));
        //this._context.subscriptions.push(languages.registerDefinitionProvider({ scheme: 'al-preview' }, new EventPublisherDefinitionProvider()));
        this._context.subscriptions.push(vscode_1.languages.registerDefinitionProvider({ language: 'al' }, new EventPublisherDefinitionProvider_1.EventPublisherDefinitionProvider()));
        //this._context.subscriptions.push(languages.registerReferenceProvider({ scheme: 'al-studio-preview' }, new SymbolReferenceProvider()));
        //this._context.subscriptions.push(languages.registerReferenceProvider({ scheme: 'al-preview' }, new SymbolReferenceProvider()));
        this._context.subscriptions.push(vscode_1.languages.registerReferenceProvider({ language: 'al' }, new SymbolReferenceProvider_1.SymbolReferenceProvider()));
        // Uri handler
        this._context.subscriptions.push(vscode_1.window.registerUriHandler(new ALStudioUriHandler_1.ALStudioUriHandler()));
    }
    _activate() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.registerBackend();
            this.registerProviders();
            this.registerCommands();
            // ensure public beta self-activation
            yield this._middlewareService.checkLicense();
            if (Application.getWorkspacePaths().length > 0) {
                this._middlewareService.getTranslations(Application.getWorkspacePaths());
                if (Application.config.advanced.skipInitialScan !== true) {
                    VSCommandService_1.VSCommandService.executeCommand(VSCommandService_1.VSCommandType.Discover).then(() => {
                        if (Application.config.basic.openHome === true) {
                            VSCommandService_1.VSCommandService.executeCommand(VSCommandService_1.VSCommandType.Dashboard);
                        }
                    });
                }
            }
            this.registerWatchers();
            this._logService.info(`Extension "${Application.extensionName}" is now activated.`);
            let externalApi = this._container.get(ExternalAPIService_1.ExternalAPIService);
            return externalApi;
        });
    }
    _deactivate() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let instance of ALStudioPanel_1.ALStudioPanel.instances) {
                instance.dispose();
                this._logService.debug('ALStudioPanel disposed');
            }
            ALStudioPanel_1.ALStudioPanel.instances = [];
            yield this._middlewareService.dispose();
            yield this._backendService.stop();
            this._watchers.map(m => m.close());
            if (this._outputChannel) {
                this._outputChannel.dispose();
            }
            this._logService.debug(`Extension "${Application.extensionName}" has been deactivated.`);
        });
    }
    static readFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                fs_extra_1.readFile(file, "utf8", (err, data) => {
                    if (err)
                        reject(err);
                    else
                        resolve(data);
                });
            });
        });
    }
    static getWorkspacePaths() {
        var _a;
        let paths = (_a = vscode_1.workspace.workspaceFolders) === null || _a === void 0 ? void 0 : _a.map((m) => m.uri.fsPath);
        return paths || [];
    }
    static getVsCodeFolder() {
        let paths = Application.getWorkspacePaths();
        if (paths.length === 0) {
            return undefined;
        }
        let result = path_1.join(paths[0], '.vscode', '.alstudio');
        return result;
    }
    static clone(obj) {
        let result = JSON.parse(JSON.stringify(obj));
        return result;
    }
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    ;
    static replaceAll(str, find, replace) {
        return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
    }
    ;
}
exports.Application = Application;
//# sourceMappingURL=Application.js.map