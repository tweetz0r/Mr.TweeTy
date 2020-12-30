"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
const Application_1 = require("./../Application");
const aurelia_dependency_injection_1 = require("aurelia-dependency-injection");
const ALStudioFeature_1 = require("../ALStudioFeature");
const signalr_1 = require("@microsoft/signalr");
const ALStudioPanel_1 = require("../ALStudioPanel");
const VSCommandService_1 = require("./VSCommandService");
let MiddlewareService = class MiddlewareService {
    constructor() {
        this._url = '';
        this._handlers = [];
    }
    //#region SignalR requests
    getProjects(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.QueryProjects, MiddlewareResponseMethod.GetProjects, false, false, msg);
        });
    }
    getObjects(msg, reload) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.QueryObjects, MiddlewareResponseMethod.GetObjects, true, true, msg, reload);
        });
    }
    getLocalObjects(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.QueryLocalObjects, MiddlewareResponseMethod.GetLocalObjects, true, false, msg);
        });
    }
    getAllLocalObjects(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.QueryAllLocalObjects, MiddlewareResponseMethod.GetAllLocalObjects, true, false, msg);
        });
    }
    getDashboard(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.QueryDashboard, MiddlewareResponseMethod.GetDashboard, true, false, msg);
        });
    }
    getTransferfieldRules(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.QueryTransferfieldRules, MiddlewareResponseMethod.QueryTransferfieldRulesResponse, true, false, msg);
        });
    }
    getProperties(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.QueryProperties, MiddlewareResponseMethod.GetProperties, true, false, msg);
        });
    }
    getPageDesign(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.QueryPageDesign, MiddlewareResponseMethod.GetPageDesign, true, true, msg);
        });
    }
    getPagePartDesign(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.QueryPagePartDesign, MiddlewareResponseMethod.GetPagePartDesign, true, true, msg);
        });
    }
    saveObjectDesign(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.SaveObject, MiddlewareResponseMethod.SaveObjectResponse, true, false, msg);
        });
    }
    getTableDesign(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.QueryTableDesign, MiddlewareResponseMethod.GetTableDesign, true, true, msg);
        });
    }
    saveTableDesign(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.SaveTable, MiddlewareResponseMethod.SaveTableResponse, true, false, msg);
        });
    }
    getEnumDesign(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.QueryEnumDesign, MiddlewareResponseMethod.GetEnumDesign, true, true, msg);
        });
    }
    saveEnumDesign(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.SaveEnum, MiddlewareResponseMethod.SaveEnumResponse, true, false, msg);
        });
    }
    getControlAddinDesign(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.QueryControladdinDesign, MiddlewareResponseMethod.GetControladdinDesign, true, true, msg);
        });
    }
    getCodeunitDesign(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.QueryCodeunitDesign, MiddlewareResponseMethod.GetCodeunitDesign, true, true, msg);
        });
    }
    getInterfaceDesign(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.QueryInterfaceDesign, MiddlewareResponseMethod.GetInterfaceDesign, true, true, msg);
        });
    }
    saveControlAddinDesign(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.SaveControladdin, MiddlewareResponseMethod.SaveControladdinResponse, true, false, msg);
        });
    }
    getSymbolSource(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.QuerySymbolSource, MiddlewareResponseMethod.GetSymbolSource, true, false, msg);
        });
    }
    getPing() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.QueryPing, MiddlewareResponseMethod.GetPing, false, false);
        });
    }
    setWorkspaces(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.QuerySymbolSource, MiddlewareResponseMethod.GetSymbolSource, true, false, msg);
        });
    }
    activateApp(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.Activate, MiddlewareResponseMethod.ActivateResponse, false, false, msg);
        });
    }
    checkLicense() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.HasValidLicense, MiddlewareResponseMethod.HasValidLicenseResponse, false, false);
        });
    }
    getLicenseReport() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.QueryLicenseReport, MiddlewareResponseMethod.GetLicenseReport, false, false);
        });
    }
    generateDocumentation(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.GenerateDocumentation, MiddlewareResponseMethod.GenerateDocumentationResponse, true, false, msg);
        });
    }
    generateProjectDocumentation(paths, output) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.GenerateWorkspaceDocumentation, MiddlewareResponseMethod.GenerateWorkspaceDocumentationResponse, true, false, paths, output);
        });
    }
    createProject(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.CreateProject, MiddlewareResponseMethod.CreateProjectResponse, true, false, msg);
        });
    }
    createObject(type, projectName, objectName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.CreateObject, MiddlewareResponseMethod.CreateObjectResponse, true, false, type, projectName, objectName);
        });
    }
    extendObject(msg, projectName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.ExtendObject, MiddlewareResponseMethod.ExtendObjectResponse, true, false, msg, projectName);
        });
    }
    autoCompleteObjectName(type, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.AutoCompleteObjectName, MiddlewareResponseMethod.AutoCompleteObjectNameResponse, true, false, type, msg);
        });
    }
    autoCompleteRunObjectName(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.AutoCompleteRunObjectName, MiddlewareResponseMethod.AutoCompleteRunObjectNameResponse, true, false, msg);
        });
    }
    loadPropertyUrl(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.LoadPropertyUrl, MiddlewareResponseMethod.LoadPropertyUrlResponse, true, false, msg);
        });
    }
    loadPropertyDocumentation(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.PropertyDocumentation, MiddlewareResponseMethod.PropertyDocumentationResponse, true, false, msg);
        });
    }
    loadPageDocumentation(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.PageDocumentation, MiddlewareResponseMethod.PageDocumentationResponse, true, false, url);
        });
    }
    loadDocumentationToc() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.DocumentationTOC, MiddlewareResponseMethod.DocumentationTOCResponse, true, false);
        });
    }
    loadDocumentationIndex() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.DocumentationIndex, MiddlewareResponseMethod.DocumentationIndexResponse, true, false);
        });
    }
    setDirtyCache(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.SetDirtyCache, MiddlewareResponseMethod.SetDirtyCacheResponse, true, false, msg);
        });
    }
    setALLanguageSettings(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.SetALLanguageSettings, MiddlewareResponseMethod.SetALLanguageSettingsResponse, true, false, msg);
        });
    }
    getTranslations(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.QueryTranslations, MiddlewareResponseMethod.GetTranslations, true, false, msg);
        });
    }
    getTableFields() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.GetTableFields, MiddlewareResponseMethod.GetTableFieldsResponse, true, false);
        });
    }
    getReportLayout(name, layout) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.GetReportLayout, MiddlewareResponseMethod.GetReportLayoutResponse, true, false, name, layout);
        });
    }
    getEventPublisherLocation(documentTxt, checkTxt) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.GetEventPublisherLocation, MiddlewareResponseMethod.GetEventPublisherLocationResponse, true, false, documentTxt, checkTxt);
        });
    }
    getLaunchConfigs(paths) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.GetLaunchConfigs, MiddlewareResponseMethod.GetLaunchConfigsResponse, true, false, paths);
        });
    }
    getLaunchUrl(projectName, info, serverInstancePostfix = '') {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.GetLaunchUrl, MiddlewareResponseMethod.GetLaunchUrlResponse, true, false, projectName, info, serverInstancePostfix);
        });
    }
    getNextId(type, projectNameOrFilePath) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.GetNextId, MiddlewareResponseMethod.GetNextIdResponse, true, false, type, projectNameOrFilePath);
        });
    }
    getReferencedLines(searchParam, includeLocal = false) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.GetReferencedLines, MiddlewareResponseMethod.GetReferencedLinesResponse, true, false, searchParam, includeLocal);
        });
    }
    search(searchParam, categories, includeLocal = false) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.Search, MiddlewareResponseMethod.SearchResponse, true, false, searchParam, categories, includeLocal);
        });
    }
    getSymbolDataFromString(objectSource) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.GetSymbolDataFromString, MiddlewareResponseMethod.GetSymbolDataFromStringResponse, true, false, objectSource);
        });
    }
    getSnapshots(paths) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.GetSnapshots, MiddlewareResponseMethod.GetSnapshotsResponse, true, true, paths);
        });
    }
    getSnapshotCallStack(path) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(MiddlewareRequestMethod.GetSnapshotCallStack, MiddlewareResponseMethod.GetSnapshotCallStackResponse, true, true, path);
        });
    }
    //#endregion
    //#region Base methods
    send(requestMethod, responseMethod, checkConnection, parseJson, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = Date.now() * Math.random();
            let handler = yield this._send(requestMethod, responseMethod, checkConnection, parseJson, id, ...args);
            yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                while (!this._handlers.find(f => f.id == id)) {
                    //await Application.sleep(10);
                }
                this._connection.off(responseMethod, handler);
                resolve(null);
            }));
            let result = this._handlers.find(f => f.id == id);
            Application_1.Application.log.debug(`${responseMethod}: handler function. ${id}`);
            return result.message;
        });
    }
    //private _responses: Array<string> = [];
    _handleResponse(responseMethod, msg, parseJson, id, checkId) {
        let checkMsg = this._handlers.find(f => f.id == id);
        if (!checkMsg) {
            if (parseJson === true) {
                msg = JSON.parse(msg);
            }
            this._handlers.push({ message: msg, id: id });
            Application_1.Application.log.debug(`${responseMethod}: response received. ${id} | ${checkId}`);
        }
        else {
            let i = this._handlers.indexOf(checkMsg);
            checkMsg.message = msg;
            this._handlers.splice(i, 1, checkMsg);
            Application_1.Application.log.debug(`${responseMethod}: response received double. ${id} | ${checkId}`);
        }
    }
    ;
    _send(requestMethod, responseMethod, checkConnection, parseJson, id, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (checkConnection === true) {
                yield this.check();
            }
            Application_1.Application.log.debug(`${requestMethod}: request sent.`, id);
            let handler = (stamp) => {
                return (msg) => this._handleResponse(responseMethod, msg, parseJson, stamp, id);
            };
            let handlerInst = handler(id);
            this._connection.on(responseMethod, handlerInst);
            yield this._connection.invoke(requestMethod, ...args).catch((err) => { throw err; });
            return handlerInst;
        });
    }
    check() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._connection.state == signalr_1.HubConnectionState.Connected) {
                return;
            }
            if (this._connection && this._connection.state == signalr_1.HubConnectionState.Disconnected) {
                yield this.connect();
            }
            else {
                yield this.init(this._url);
            }
        });
    }
    init(url) {
        return __awaiter(this, void 0, void 0, function* () {
            let reconnectPeriods = [];
            for (let i = 0; i < 10; i++) {
                reconnectPeriods.push(3000);
            }
            for (let i = 0; i < 10; i++) {
                reconnectPeriods.push(5000);
            }
            for (let i = 0; i < 10; i++) {
                reconnectPeriods.push(10000);
            }
            this._url = url;
            let builder = new signalr_1.HubConnectionBuilder();
            builder = builder
                .withUrl(`${url}/alstudio`)
                .configureLogging(signalr_1.LogLevel.Debug)
                .withAutomaticReconnect(reconnectPeriods);
            this._connection = builder.build();
            this._connection.serverTimeoutInMilliseconds = 15 * 60 * 1000;
            this._connection.keepAliveIntervalInMilliseconds = 5 * 1000;
            this._connection.onreconnecting(error => {
                let msg = `Backend connection lost due to error "${error}". Reconnecting.`;
                Application_1.Application.log.warn(msg);
                //Application.ui.warn(msg);
            });
            this._connection.onreconnected(id => {
                let msg = `Backend connection has beed restored.`;
                Application_1.Application.log.info(msg);
                //Application.ui.info(msg);
                VSCommandService_1.VSCommandService.executeCommand(VSCommandService_1.VSCommandType.Discover);
            });
            this._connection.onclose(error => {
                let msg = `Backend connection closed due to error "${error}".`;
                Application_1.Application.log.error(msg);
                Application_1.Application.ui.error(msg);
            });
            /*this._connection.on('UpdateObjects', async () => {
                let panel = ALStudioPanel.instances.find(f => f.feature == ALStudioFeature.ObjectDesigner);
                if (panel) {
                    //await panel.postMessage({ Command: 'UpdateObjects' });
                }
            });*/
            this._connection.on('UpdateObject', (path, oldPath) => __awaiter(this, void 0, void 0, function* () {
                let panels = ALStudioPanel_1.ALStudioPanel.instances.filter(f => [ALStudioFeature_1.ALStudioFeature.EnumDesigner,
                    ALStudioFeature_1.ALStudioFeature.PageDesigner,
                    ALStudioFeature_1.ALStudioFeature.PagePreview,
                    ALStudioFeature_1.ALStudioFeature.TableDesigner].indexOf(f.feature) != -1);
                for (let panel of panels) {
                    yield panel.postMessage({ Command: 'UpdateObject', Data: { path: path, oldPath: oldPath } });
                }
            }));
            yield this.connect();
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._connection.start();
            return true;
        });
    }
    dispose() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._connection) {
                if ([signalr_1.HubConnectionState.Disconnected, signalr_1.HubConnectionState.Disconnecting].indexOf(this._connection.state) != -1)
                    return;
                yield this._connection.stop();
            }
        });
    }
};
MiddlewareService = __decorate([
    aurelia_dependency_injection_1.singleton(true),
    __metadata("design:paramtypes", [])
], MiddlewareService);
exports.MiddlewareService = MiddlewareService;
var MiddlewareRequestMethod;
(function (MiddlewareRequestMethod) {
    MiddlewareRequestMethod["QueryProjects"] = "QueryProjects";
    MiddlewareRequestMethod["QueryObjects"] = "QueryObjects";
    MiddlewareRequestMethod["SetWorkspaces"] = "SetWorkspaces";
    MiddlewareRequestMethod["QueryLocalObjects"] = "QueryLocalObjects";
    MiddlewareRequestMethod["QueryAllLocalObjects"] = "QueryAllLocalObjects";
    MiddlewareRequestMethod["QueryProperties"] = "QueryProperties";
    MiddlewareRequestMethod["QueryPageDesign"] = "QueryPageDesign";
    MiddlewareRequestMethod["QueryTableDesign"] = "QueryTableDesign";
    MiddlewareRequestMethod["QueryEnumDesign"] = "QueryEnumDesign";
    MiddlewareRequestMethod["QueryControladdinDesign"] = "QueryControladdinDesign";
    MiddlewareRequestMethod["QueryCodeunitDesign"] = "QueryCodeunitDesign";
    MiddlewareRequestMethod["QuerySymbolSource"] = "QuerySymbolSource";
    MiddlewareRequestMethod["SaveObject"] = "SaveObject";
    MiddlewareRequestMethod["SaveTable"] = "SaveTable";
    MiddlewareRequestMethod["SaveEnum"] = "SaveEnum";
    MiddlewareRequestMethod["SaveControladdin"] = "SaveControladdin";
    MiddlewareRequestMethod["QueryPing"] = "QueryPing";
    MiddlewareRequestMethod["Activate"] = "Activate";
    MiddlewareRequestMethod["HasValidLicense"] = "HasValidLicense";
    MiddlewareRequestMethod["QueryLicenseReport"] = "QueryLicenseReport";
    MiddlewareRequestMethod["GenerateDocumentation"] = "GenerateDocumentation";
    MiddlewareRequestMethod["GenerateWorkspaceDocumentation"] = "GenerateWorkspaceDocumentation";
    MiddlewareRequestMethod["CreateProject"] = "CreateProject";
    MiddlewareRequestMethod["CreateObject"] = "CreateObject";
    MiddlewareRequestMethod["ExtendObject"] = "ExtendObject";
    MiddlewareRequestMethod["SetDirtyCache"] = "SetDirtyCache";
    MiddlewareRequestMethod["QueryDashboard"] = "QueryDashboard";
    MiddlewareRequestMethod["QueryTranslations"] = "QueryTranslations";
    MiddlewareRequestMethod["QueryPagePartDesign"] = "QueryPagePartDesign";
    MiddlewareRequestMethod["QueryInterfaceDesign"] = "QueryInterfaceDesign";
    MiddlewareRequestMethod["AutoCompleteObjectName"] = "AutoCompleteObjectName";
    MiddlewareRequestMethod["AutoCompleteRunObjectName"] = "AutoCompleteRunObjectName";
    MiddlewareRequestMethod["LoadPropertyUrl"] = "LoadPropertyUrl";
    MiddlewareRequestMethod["PropertyDocumentation"] = "PropertyDocumentation";
    MiddlewareRequestMethod["PageDocumentation"] = "PageDocumentation";
    MiddlewareRequestMethod["DocumentationTOC"] = "DocumentationTOC";
    MiddlewareRequestMethod["DocumentationIndex"] = "DocumentationIndex";
    MiddlewareRequestMethod["SetALLanguageSettings"] = "SetALLanguageSettings";
    MiddlewareRequestMethod["QueryTransferfieldRules"] = "QueryTransferfieldRules";
    MiddlewareRequestMethod["GetTableFields"] = "GetTableFields";
    MiddlewareRequestMethod["GetReportLayout"] = "GetReportLayout";
    MiddlewareRequestMethod["GetEventPublisherLocation"] = "GetEventPublisherLocation";
    MiddlewareRequestMethod["GetLaunchConfigs"] = "GetLaunchConfigs";
    MiddlewareRequestMethod["GetLaunchUrl"] = "GetLaunchUrl";
    MiddlewareRequestMethod["GetNextId"] = "GetNextId";
    MiddlewareRequestMethod["GetReferencedLines"] = "GetReferencedLines";
    MiddlewareRequestMethod["Search"] = "Search";
    MiddlewareRequestMethod["GetSymbolDataFromString"] = "GetSymbolDataFromString";
    MiddlewareRequestMethod["GetSnapshots"] = "GetSnapshots";
    MiddlewareRequestMethod["GetSnapshotCallStack"] = "GetSnapshotCallStack";
})(MiddlewareRequestMethod = exports.MiddlewareRequestMethod || (exports.MiddlewareRequestMethod = {}));
var MiddlewareResponseMethod;
(function (MiddlewareResponseMethod) {
    MiddlewareResponseMethod["GetProjects"] = "GetProjects";
    MiddlewareResponseMethod["GetObjects"] = "GetObjects";
    MiddlewareResponseMethod["SetWorkspacesResponse"] = "SetWorkspacesResponse";
    MiddlewareResponseMethod["GetLocalObjects"] = "GetLocalObjects";
    MiddlewareResponseMethod["GetAllLocalObjects"] = "GetAllLocalObjects";
    MiddlewareResponseMethod["GetProperties"] = "GetProperties";
    MiddlewareResponseMethod["GetPageDesign"] = "GetPageDesign";
    MiddlewareResponseMethod["GetTableDesign"] = "GetTableDesign";
    MiddlewareResponseMethod["GetEnumDesign"] = "GetEnumDesign";
    MiddlewareResponseMethod["GetControladdinDesign"] = "GetControladdinDesign";
    MiddlewareResponseMethod["GetCodeunitDesign"] = "GetCodeunitDesign";
    MiddlewareResponseMethod["GetSymbolSource"] = "GetSymbolSource";
    MiddlewareResponseMethod["SaveObjectResponse"] = "SaveObjectResponse";
    MiddlewareResponseMethod["SaveTableResponse"] = "SaveTableResponse";
    MiddlewareResponseMethod["SaveEnumResponse"] = "SaveEnumResponse";
    MiddlewareResponseMethod["SaveControladdinResponse"] = "SaveControladdinResponse";
    MiddlewareResponseMethod["GetPing"] = "GetPing";
    MiddlewareResponseMethod["ActivateResponse"] = "ActivateResponse";
    MiddlewareResponseMethod["HasValidLicenseResponse"] = "HasValidLicenseResponse";
    MiddlewareResponseMethod["GetLicenseReport"] = "GetLicenseReport";
    MiddlewareResponseMethod["UpdateObject"] = "UpdateObject";
    MiddlewareResponseMethod["GenerateDocumentationResponse"] = "GenerateDocumentationResponse";
    MiddlewareResponseMethod["GenerateWorkspaceDocumentationResponse"] = "GenerateWorkspaceDocumentationResponse";
    MiddlewareResponseMethod["CreateProjectResponse"] = "CreateProjectResponse";
    MiddlewareResponseMethod["CreateObjectResponse"] = "CreateObjectResponse";
    MiddlewareResponseMethod["ExtendObjectResponse"] = "ExtendObjectResponse";
    MiddlewareResponseMethod["SetDirtyCacheResponse"] = "SetDirtyCacheResponse";
    MiddlewareResponseMethod["GetDashboard"] = "GetDashboard";
    MiddlewareResponseMethod["GetTranslations"] = "GetTranslations";
    MiddlewareResponseMethod["GetPagePartDesign"] = "GetPagePartDesign";
    MiddlewareResponseMethod["GetInterfaceDesign"] = "GetInterfaceDesign";
    MiddlewareResponseMethod["AutoCompleteObjectNameResponse"] = "AutoCompleteObjectNameResponse";
    MiddlewareResponseMethod["AutoCompleteRunObjectNameResponse"] = "AutoCompleteRunObjectNameResponse";
    MiddlewareResponseMethod["LoadPropertyUrlResponse"] = "LoadPropertyUrlResponse";
    MiddlewareResponseMethod["PageDocumentationResponse"] = "PageDocumentationResponse";
    MiddlewareResponseMethod["PropertyDocumentationResponse"] = "PropertyDocumentationResponse";
    MiddlewareResponseMethod["DocumentationTOCResponse"] = "DocumentationTOCResponse";
    MiddlewareResponseMethod["DocumentationIndexResponse"] = "DocumentationIndexResponse";
    MiddlewareResponseMethod["SetALLanguageSettingsResponse"] = "SetALLanguageSettingsResponse";
    MiddlewareResponseMethod["QueryTransferfieldRulesResponse"] = "QueryTransferfieldRulesResponse";
    MiddlewareResponseMethod["GetTableFieldsResponse"] = "GetTableFieldsResponse";
    MiddlewareResponseMethod["GetReportLayoutResponse"] = "GetReportLayoutResponse";
    MiddlewareResponseMethod["GetEventPublisherLocationResponse"] = "GetEventPublisherLocationResponse";
    MiddlewareResponseMethod["GetLaunchConfigsResponse"] = "GetLaunchConfigsResponse";
    MiddlewareResponseMethod["GetLaunchUrlResponse"] = "GetLaunchUrlResponse";
    MiddlewareResponseMethod["GetNextIdResponse"] = "GetNextIdResponse";
    MiddlewareResponseMethod["GetReferencedLinesResponse"] = "GetReferencedLinesResponse";
    MiddlewareResponseMethod["SearchResponse"] = "SearchResponse";
    MiddlewareResponseMethod["GetSymbolDataFromStringResponse"] = "GetSymbolDataFromStringResponse";
    MiddlewareResponseMethod["GetSnapshotsResponse"] = "GetSnapshotsResponse";
    MiddlewareResponseMethod["GetSnapshotCallStackResponse"] = "GetSnapshotCallStackResponse";
})(MiddlewareResponseMethod = exports.MiddlewareResponseMethod || (exports.MiddlewareResponseMethod = {}));
//# sourceMappingURL=MiddlewareService.js.map