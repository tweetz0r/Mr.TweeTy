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
const Application_1 = require("./Application");
const ALStudioPanelCommandService_1 = require("./Services/ALStudioPanelCommandService");
const vscode_1 = require("vscode");
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const ALStudioFeature_1 = require("./ALStudioFeature");
const VSCommandService_1 = require("./Services/VSCommandService");
class ALStudioPanel {
    constructor(openFeature, openOptions, fsPath) {
        this.title = '';
        this.fsPath = '';
        this.textEditors = [];
        this.options = {};
        this.extensionPath = '';
        this._disposables = [];
        this.extensionPath = Application_1.Application.context.extensionPath;
        this.feature = openFeature;
        this.options = openOptions;
        this.fsPath = fsPath || '';
    }
    static open(openFeature, openOptions, fsPath) {
        return __awaiter(this, void 0, void 0, function* () {
            if ([
                ALStudioFeature_1.ALStudioFeature.Home,
                ALStudioFeature_1.ALStudioFeature.ObjectDesigner,
                ALStudioFeature_1.ALStudioFeature.CreateWorkspace,
                ALStudioFeature_1.ALStudioFeature.AddProject,
                ALStudioFeature_1.ALStudioFeature.Dashboard,
                ALStudioFeature_1.ALStudioFeature.TranslationManager,
                ALStudioFeature_1.ALStudioFeature.OfficalDocs
            ].indexOf(openFeature) !== -1) {
                let mainWindow = ALStudioPanel.instances.find(f => f.feature == openFeature);
                if (mainWindow && mainWindow.panel && mainWindow.panel.webview) {
                    ALStudioPanel.instance = mainWindow;
                    ALStudioPanel.instance.panel.reveal(openFeature == ALStudioFeature_1.ALStudioFeature.OfficalDocs ? vscode_1.ViewColumn.Beside : vscode_1.ViewColumn.One);
                    if (openFeature == ALStudioFeature_1.ALStudioFeature.OfficalDocs) {
                        ALStudioPanel.instance.postMessage({ Command: 'UpdateProperty', Data: openOptions.Data });
                    }
                    return;
                }
            }
            let instance = new ALStudioPanel(openFeature, openOptions, fsPath);
            ALStudioPanel.instance = instance;
            ALStudioPanel.instances.push(instance);
            //ALStudioPanel.refreshSidebar(VSCommandType.OpenTreeRefreshEntry);
            yield instance.createPanel();
        });
    }
    static postMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ALStudioPanel.instance.postMessage(message);
        });
    }
    static refreshHome() {
        let alHomes = ALStudioPanel.instances.filter(f => [ALStudioFeature_1.ALStudioFeature.Dashboard, ALStudioFeature_1.ALStudioFeature.SideBarDashboard].indexOf(f.feature) != -1);
        if (alHomes.length > 0) {
            Application_1.Application.dashboardList = null;
        }
        for (let alHome of alHomes) {
            alHome.postMessage({ Command: 'UpdateObjects', Data: null });
        }
    }
    static refreshSidebar(type) {
        if (!type) {
            VSCommandService_1.VSCommandService.executeCommand(VSCommandService_1.VSCommandType.ScopeTreeRefreshEntry);
            //VSCommandService.executeCommand(VSCommandType.OpenTreeRefreshEntry);
            VSCommandService_1.VSCommandService.executeCommand(VSCommandService_1.VSCommandType.TreeRefreshEntry);
        }
        else {
            VSCommandService_1.VSCommandService.executeCommand(type);
        }
    }
    static showByTitle(title) {
        let panel = ALStudioPanel.instances.find(f => f.title.endsWith(title));
        if (panel) {
            panel.show();
            return true;
        }
        return false;
    }
    updateSidebar(show) {
        if (this.feature == ALStudioFeature_1.ALStudioFeature.Dashboard) {
            let sidebar = ALStudioPanel.instances.find(f => f.feature == ALStudioFeature_1.ALStudioFeature.SideBarDashboard);
            if (sidebar) {
                sidebar.postMessage({ Command: 'ALHomeVisible', Data: show, Callback: true });
            }
        }
    }
    get panelVisible() {
        return this.panel.visible;
    }
    createPanel() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.title = ((_a = this.options) === null || _a === void 0 ? void 0 : _a.title) || 'AL Studio';
            let viewColumn = this.feature == ALStudioFeature_1.ALStudioFeature.PagePreview || this.feature == ALStudioFeature_1.ALStudioFeature.OfficalDocs ? vscode_1.ViewColumn.Beside : vscode_1.ViewColumn.One;
            this.panel = vscode_1.window.createWebviewPanel("alStudio", this.title, viewColumn, {
                // Enable javascript in the webview
                enableScripts: true,
                enableFindWidget: true,
                retainContextWhenHidden: true,
                localResourceRoots: [
                    vscode_1.Uri.file(path_1.join(this.extensionPath, 'WebView')),
                    vscode_1.Uri.file(path_1.join(this.extensionPath, 'WebView', 'fonts')),
                    vscode_1.Uri.file(path_1.join(this.extensionPath, 'WebView', 'scripts'))
                ]
            });
            this.panel.iconPath = {
                dark: vscode_1.Uri.file(path_1.join(Application_1.Application.context.extensionPath, 'resources', 'Logo1-light.svg')),
                light: vscode_1.Uri.file(path_1.join(Application_1.Application.context.extensionPath, 'resources', 'Logo1-dark.svg')),
            };
            this.panel.webview.html = yield this._getHtmlForWebview(this.panel.webview);
            // events
            this._disposables.push(this.panel.onDidDispose(() => {
                this.dispose();
                this.updateSidebar(false);
            }, null, this._disposables));
            this._disposables.push(this.panel.onDidChangeViewState((e) => {
                if ([
                    ALStudioFeature_1.ALStudioFeature.TableDesigner,
                    ALStudioFeature_1.ALStudioFeature.PageDesigner,
                    ALStudioFeature_1.ALStudioFeature.EnumDesigner,
                ].indexOf(this.feature) !== -1) {
                    Application_1.Application.designerEmittedChange = e.webviewPanel.active;
                }
                this.updateSidebar(this.panel.visible);
            }));
            this.updateSidebar(this.panel.visible);
            // Handle messages from the webview
            this.panel.webview.onDidReceiveMessage(((messages) => __awaiter(this, void 0, void 0, function* () {
                let handler = new ALStudioPanelCommandService_1.ALStudioPanelCommandService(this);
                if (messages && messages.length > 0) {
                    let tasks = messages.map((message) => __awaiter(this, void 0, void 0, function* () {
                        var _b;
                        try {
                            yield handler.dispatch(message);
                        }
                        catch (e) {
                            Application_1.Application.ui.error(`${((_b = e) === null || _b === void 0 ? void 0 : _b.message) ? `${e.message}` : 'AL Studio Server error. Check "Help / Toggle Developer Tools" for details.'}`);
                            Application_1.Application.log.error(`Failed to execute command: ${message.Command}`, e);
                        }
                    }));
                    Promise.all(tasks);
                }
            })).bind(this), null, this._disposables);
        });
    }
    resolveWebviewView(webviewView, context, _token) {
        var _a;
        this.view = webviewView;
        this.view.title = ((_a = this.options) === null || _a === void 0 ? void 0 : _a.title) || 'AL Studio';
        this.view.webview.options = {
            // Enable javascript in the webview
            enableScripts: true,
            localResourceRoots: [
                vscode_1.Uri.file(path_1.join(this.extensionPath, 'WebView')),
                vscode_1.Uri.file(path_1.join(this.extensionPath, 'WebView', 'scripts'))
            ]
        };
        let startupOptions = {
            start: this.feature,
            options: this.options
        };
        let content = fs_extra_1.readFileSync(path_1.join(this.extensionPath, 'WebView', 'index.html'), { encoding: 'utf-8' });
        let appOnDiskPath = vscode_1.Uri.file(path_1.join(this.extensionPath, 'WebView', 'scripts', 'bundle.js'));
        let appJsSrc = this.view.webview.asWebviewUri(appOnDiskPath);
        content = content.replace('//${vscodeApi}', 'window.vscode = acquireVsCodeApi();');
        content = content.replace('//${startupOptions}', `window.startupOptions = '${JSON.stringify(startupOptions)}';`);
        content = content.replace('scripts/bundle.js', appJsSrc);
        this.view.webview.html = content;
        // events
        let updateVisibility = () => {
            let handler = new ALStudioPanelCommandService_1.ALStudioPanelCommandService(this);
            handler.ToggleSidebarOnHomeCommand({ Command: 'ToggleSidebarOnHome', Data: this.view.visible });
            let dashboard = ALStudioPanel.instances.find(f => f.feature == ALStudioFeature_1.ALStudioFeature.Dashboard);
            if (dashboard) {
                this.updateSidebar(dashboard.panel.visible);
            }
        };
        this._disposables.push(this.view.onDidDispose(() => this.dispose(), null, this._disposables));
        this._disposables.push(this.view.onDidChangeVisibility(() => updateVisibility(), null, this._disposables));
        updateVisibility();
        // Handle messages from the webview
        this.view.webview.onDidReceiveMessage(((messages) => __awaiter(this, void 0, void 0, function* () {
            let handler = new ALStudioPanelCommandService_1.ALStudioPanelCommandService(this);
            if (messages && messages.length > 0) {
                let tasks = messages.map((message) => __awaiter(this, void 0, void 0, function* () {
                    var _b;
                    try {
                        yield handler.dispatch(message);
                    }
                    catch (e) {
                        Application_1.Application.ui.error(`${((_b = e) === null || _b === void 0 ? void 0 : _b.message) ? `${e.message}` : 'AL Studio Server error. Check "Help / Toggle Developer Tools" for details.'}`);
                        Application_1.Application.log.error(`Failed to execute command: ${message.Command}`, e);
                    }
                }));
                Promise.all(tasks);
            }
        })).bind(this), null, this._disposables);
    }
    show() {
        this.panel.reveal();
    }
    setTitle(newTitle) {
        this.panel.title = newTitle;
        this.title = newTitle;
        //ALStudioPanel.refreshSidebar(VSCommandType.OpenTreeRefreshEntry);
    }
    setTitleDirty() {
        this.panel.title = '[*] ' + this.panel.title;
        this.title = this.panel.title;
        //ALStudioPanel.refreshSidebar(VSCommandType.OpenTreeRefreshEntry);
    }
    setTitleSaved() {
        this.panel.title.replace('[*] ', '');
        this.panel.title = this.panel.title;
        this.title = this.panel.title;
        //ALStudioPanel.refreshSidebar(VSCommandType.OpenTreeRefreshEntry);
    }
    postMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let view = (this.panel || this.view);
            if (view) {
                yield view.webview.postMessage(message);
            }
        });
    }
    _getHtmlForWebview(webview) {
        return __awaiter(this, void 0, void 0, function* () {
            let advSettings = yield Application_1.Application.config.advanced;
            this.options.navigateOnPageActionClick = advSettings.navigateOnPageActionClick;
            let startupOptions = {
                start: this.feature,
                options: this.options
            };
            let content = yield Application_1.Application.readFile(path_1.join(this.extensionPath, 'WebView', 'index.html'));
            let appOnDiskPath = vscode_1.Uri.file(path_1.join(this.extensionPath, 'WebView', 'scripts', 'bundle.js'));
            let appJsSrc = webview.asWebviewUri(appOnDiskPath);
            content = content.replace('//${vscodeApi}', 'window.vscode = acquireVsCodeApi();');
            content = content.replace('//${startupOptions}', `window.startupOptions = '${JSON.stringify(startupOptions)}';`);
            content = content.replace('scripts/bundle.js', appJsSrc);
            return content;
        });
    }
    dispose() {
        var _a;
        // Clean up our resources
        Application_1.Application.designerEmittedChange = false;
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
        (_a = this.panel) === null || _a === void 0 ? void 0 : _a.dispose();
        let i = ALStudioPanel.instances.indexOf(this);
        if (i != -1) {
            ALStudioPanel.instances.splice(i, 1);
        }
        //ALStudioPanel.refreshSidebar(VSCommandType.OpenTreeRefreshEntry);
        ALStudioPanel.instance = null;
    }
}
exports.ALStudioPanel = ALStudioPanel;
ALStudioPanel.instances = [];
ALStudioPanel.objectList = [];
//# sourceMappingURL=ALStudioPanel.js.map