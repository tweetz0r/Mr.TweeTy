"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
const al_studio_1 = require("../typings/al-studio");
const al_studio_2 = require("../typings/al-studio");
const vscode_1 = require("vscode");
const Application_1 = require("../Application");
const aurelia_dependency_injection_1 = require("aurelia-dependency-injection");
const VSCommandService_1 = require("./VSCommandService");
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
let ALLanguageApiService = class ALLanguageApiService {
    get extensionConfig() {
        let config = Application_1.Application.clone(vscode_1.workspace.getConfiguration('al'));
        return config;
    }
    getALRuntimeAPI() {
        return __awaiter(this, void 0, void 0, function* () {
            let alRuntime = vscode_1.extensions.getExtension('ms-dynamics-smb.al');
            if (!alRuntime) {
                alRuntime = vscode_1.extensions.getExtension('microsoft.al');
            }
            if (!alRuntime) {
                Application_1.Application.ui.error('AL Language extension cannot be found.');
                Application_1.Application.log.error('AL Language extension cannot be found.');
            }
            if (!alRuntime.isActive) {
                yield alRuntime.activate();
            }
            return alRuntime.exports;
        });
    }
    getAlRuntimeService(type) {
        return __awaiter(this, void 0, void 0, function* () {
            let alAPI = yield this.getALRuntimeAPI();
            let service = alAPI.services.find(f => f.constructor.name == type);
            return service;
        });
    }
    getAlRuntimeSettings(workspacePath) {
        let result = Object.assign({});
        let config = Application_1.Application.clone(vscode_1.workspace.getConfiguration('al', vscode_1.Uri.file(workspacePath)));
        for (let name in result) {
            result[name] = config[name];
        }
        return {
            workspacePath: workspacePath,
            alResourceConfigurationSettings: result,
            setActiveWorkspace: true,
            dependencyParentWorkspacePath: undefined
        };
    }
    setActiveWorkspace(newWorkspacePath) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            /*let editorService = await this.getEditorService();
            let settings = this.getAlRuntimeSettings(newWorkspacePath);
            let result = await editorService.languageServerClient.sendRequest('al/setActiveWorkspace', {
                currentWorkspaceFolderPath: newWorkspacePath,
                settings: settings
            });
    
            console.log('result', result);
            editorService.languageServerClient.lastActiveWorkspacePath = newWorkspacePath;*/
            let folder = (_a = vscode_1.workspace.workspaceFolders) === null || _a === void 0 ? void 0 : _a.find(f => f.uri.fsPath == vscode_1.Uri.file(newWorkspacePath).fsPath);
            if (!folder) {
                folder = vscode_1.workspace.workspaceFolders[0];
            }
            vscode_1.window.setStatusBarMessage(folder.name);
        });
    }
    publishDebug(workspacePath, debug) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setActiveWorkspace(workspacePath);
            let buildService = yield this.getBuildService();
            buildService.publishContainer(!debug, false);
        });
    }
    launchDebugger(path, buildType, snapshotName) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let workspacePath = (_a = vscode_1.workspace.getWorkspaceFolder(vscode_1.Uri.file(path))) === null || _a === void 0 ? void 0 : _a.uri.fsPath; //workspace.workspaceFolders?.find(f => f.uri.fsPath == Uri.file(workspacePath).fsPath);
            if (!workspacePath) {
                workspacePath = (_b = vscode_1.workspace.workspaceFolders[0]) === null || _b === void 0 ? void 0 : _b.uri.fsPath;
            }
            yield this.setActiveWorkspace(workspacePath);
            let action = '';
            switch (buildType) {
                case al_studio_1.BuildType.BuildOnly:
                    action = 'al.package';
                    break;
                case al_studio_1.BuildType.DebugOnly:
                    action = 'al.onlyDebug';
                    break;
                case al_studio_1.BuildType.PublishAndDebug:
                    action = 'al.publish';
                    break;
                case al_studio_1.BuildType.PublishAndRun:
                    action = 'al.publishNoDebug';
                    break;
                case al_studio_1.BuildType.RapidPublishAndDebug:
                    action = 'al.incrementalPublish';
                    break;
                case al_studio_1.BuildType.RapidPublishOnly:
                    action = 'al.incrementalPublishNoDebug';
                    break;
                case al_studio_1.BuildType.DownloadSymbols:
                    action = 'al.downloadSymbols';
                    break;
                case al_studio_1.BuildType.SnapshotInitialize:
                    action = 'al.initalizeSnapshotDebugging';
                    break;
                case al_studio_1.BuildType.SnapshotFinish:
                    action = 'al.finishSnapshotDebugging';
                    break;
                case al_studio_1.BuildType.SnapshotReplay:
                    action = 'al.snapshots';
                    break;
            }
            let appJson = path_1.join(workspacePath, 'app.json');
            let doc = yield vscode_1.workspace.openTextDocument(vscode_1.Uri.file(appJson));
            yield vscode_1.window.showTextDocument(doc);
            if ([al_studio_1.BuildType.BuildOnly,
                al_studio_1.BuildType.PublishAndDebug,
                al_studio_1.BuildType.PublishAndRun,
                al_studio_1.BuildType.RapidPublishAndDebug,
                al_studio_1.BuildType.RapidPublishOnly]
                .indexOf(buildType) != -1) {
                if (fs_extra_1.pathExistsSync(path_1.join(workspacePath, 'extensionsPermissionSet.xml')) !== true) {
                    yield VSCommandService_1.VSCommandService.executeCommand('al.generatePermissionSetForExtensionObjects');
                }
                if (fs_extra_1.pathExistsSync(path_1.join(workspacePath, 'entitlements.json')) !== true) {
                    VSCommandService_1.VSCommandService.executeCommand('al.generateEntitlementsForExtensionObjects');
                }
            }
            if (buildType == al_studio_1.BuildType.SnapshotReplay) {
                yield this.runSnapshot(snapshotName);
            }
            else {
                yield VSCommandService_1.VSCommandService.executeCommand(action);
            }
            VSCommandService_1.VSCommandService.executeCommand('workbench.action.closeActiveEditor');
        });
    }
    performBuild(workspacePath) {
        return __awaiter(this, void 0, void 0, function* () {
            let editorService = yield this.getEditorService();
            let result = yield editorService.languageServerClient.sendRequest('al/createPackage', {
                projectDir: workspacePath,
                args: ['-project:"' + workspacePath + '"'],
                isRad: false
            });
            console.log('build result', result);
        });
    }
    getEditorService() {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.getAlRuntimeService(al_studio_2.ALApiServiceType.EditorService);
            return result;
        });
    }
    getBuildService() {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.getAlRuntimeService(al_studio_2.ALApiServiceType.BuildService);
            return result;
        });
    }
    getSnapshotDebuggerService() {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.getAlRuntimeService(al_studio_2.ALApiServiceType.SnapshotDebuggerService);
            return result;
        });
    }
    runSnapshot(snapshotName) {
        return __awaiter(this, void 0, void 0, function* () {
            Application_1.Application.log.info('runSnapshot', snapshotName);
            let service = yield this.getSnapshotDebuggerService();
            let originalDelegate = service.SnapshotStatusFilterDelegate;
            if (snapshotName && snapshotName.length > 0) {
                service.SnapshotStatusFilterDelegate = () => snapshotName;
            }
            service.showSnapshots();
            service.SnapshotStatusFilterDelegate = originalDelegate;
        });
    }
};
ALLanguageApiService = __decorate([
    aurelia_dependency_injection_1.singleton()
], ALLanguageApiService);
exports.ALLanguageApiService = ALLanguageApiService;
//# sourceMappingURL=ALLanguageApiService.js.map