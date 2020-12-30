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
const al_studio_1 = require("../typings/al-studio");
//import { ALStudioScopeItem } from './ALScopeProvider';
//import { ALProjectService } from './ALProjectService';
const VSCommandService_1 = require("./VSCommandService");
const MiddlewareService_1 = require("./MiddlewareService");
const ALStudioPanel_1 = require("../ALStudioPanel");
const Application_1 = require("../Application");
const clipboardy = require("clipboardy");
const ALStudioFeature_1 = require("../ALStudioFeature");
const vscode_1 = require("vscode");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const ALScopeService_1 = require("./ALScopeService");
const ALLanguageApiService_1 = require("./ALLanguageApiService");
const sanitize = require('sanitize-filename');
const open = require("open");
class ALStudioPanelCommandService {
    constructor(_alPanel) {
        this.extensionPath = '';
        this.alPanel = _alPanel;
        this.extensionPath = Application_1.Application.context.extensionPath;
        this.middlewareService = Application_1.Application.container.get(MiddlewareService_1.MiddlewareService);
        this.alScopeService = Application_1.Application.container.get(ALScopeService_1.ALScopeService);
        this.alLanguageApiService = Application_1.Application.container.get(ALLanguageApiService_1.ALLanguageApiService);
    }
    dispatch(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let functionName = `${message.Command}Command`;
            if (Object.keys(this)) {
                //@ts-ignore
                yield this[functionName](message);
            }
            else {
                yield Application_1.Application.ui.info(`'${message.Command}' command was not found.`);
            }
        });
    }
    checkLicense() {
        return __awaiter(this, void 0, void 0, function* () {
            let check = yield this.isLicensed();
            if (check !== true) {
                throw new Error("This feature is not available in AL Studio Community version. Please subscribe to one of our plans on https://al.studio to get a license key.");
            }
        });
    }
    isLicensed() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.middlewareService.checkLicense();
        });
    }
    ActivateCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield VSCommandService_1.VSCommandService.executeCommand(VSCommandService_1.VSCommandType.Activate);
            this.alPanel.postMessage(null);
        });
    }
    SnapshotsCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield VSCommandService_1.VSCommandService.executeCommand(VSCommandService_1.VSCommandType.Snapshots);
            this.alPanel.postMessage(null);
        });
    }
    CopyCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield clipboardy.write(message.Data);
            this.alPanel.postMessage(null);
        });
    }
    GetLicenseReportCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.middlewareService.getLicenseReport();
            this.alPanel.postMessage({ Command: 'GetLicenseReport', Data: result });
        });
    }
    LoadControlAddinDesignCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            //await this.checkLicense();
            let design;
            let data = Object.assign({}, message.Data);
            design = yield this.middlewareService.getControlAddinDesign(data);
            this.alPanel.setTitle(`Add-in ${design.Name}`);
            this.alPanel.postMessage({ Command: 'LoadControlAddinDesign', Data: design });
        });
    }
    LoadCodeunitDesignCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            //await this.checkLicense();
            let design;
            let data = Object.assign({}, message.Data);
            design = yield this.middlewareService.getCodeunitDesign(data);
            this.alPanel.setTitle(`Codeunit ${design.Name}`);
            this.alPanel.postMessage({ Command: 'LoadCodeunitDesign', Data: design });
        });
    }
    LoadInterfaceDesignCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            //await this.checkLicense();
            let design;
            let data = Object.assign({}, message.Data);
            design = yield this.middlewareService.getInterfaceDesign(data);
            this.alPanel.setTitle(`Interface ${design.Name}`);
            this.alPanel.postMessage({ Command: 'LoadInterfaceDesign', Data: design });
        });
    }
    LoadEnumDesignCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            //await this.checkLicense();
            let design;
            let data = Object.assign({}, message.Data);
            design = yield this.middlewareService.getEnumDesign(data);
            this.alPanel.setTitle(`Enum ${design.Name}`);
            this.alPanel.postMessage({ Command: 'LoadEnumDesign', Data: design });
        });
    }
    LoadObjectPropertiesCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            //await this.checkLicense();
            let props;
            let data = Object.assign({}, message.Data);
            props = yield this.middlewareService.getProperties(data);
            this.alPanel.postMessage({ Command: 'LoadObjectProperties', Data: props });
        });
    }
    LoadDashboardCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            //let result;
            //if (Application.dashboardList === null) {
            let result = yield this.middlewareService.getDashboard(Application_1.Application.getWorkspacePaths());
            //    Application.dashboardList = result;
            //}
            this.alPanel.postMessage({ Command: 'LoadDashboard', Data: result });
        });
    }
    LoadProjectsCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.middlewareService.getProjects(Application_1.Application.getWorkspacePaths());
            this.alPanel.postMessage({ Command: 'LoadProjects', Data: result });
        });
    }
    LoadSnapshotsCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.middlewareService.getSnapshots(Application_1.Application.getWorkspacePaths());
            this.alPanel.postMessage({ Command: 'LoadSnapshots', Data: result });
        });
    }
    LoadSnapshotCallStackCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.middlewareService.getSnapshotCallStack(message.Data);
            this.alPanel.postMessage({ Command: 'LoadSnapshotCallStack', Data: result });
        });
    }
    LoadObjectsCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            //await VSCommandService.executeCommand(VSCommandType.Discover);
            if (Application_1.Application.dirtyCache === true) {
                yield VSCommandService_1.VSCommandService.executeCommand(VSCommandService_1.VSCommandType.Discover);
                Application_1.Application.dirtyCache = false;
            }
            let objects = Application_1.Application.objectList;
            let objectView = objects.map((m) => {
                let item = Object.assign({}, m);
                delete item.EventParameters;
                delete item.SymbolData;
                delete item.FsPath;
                delete item.SymbolZipName;
                delete item.CanExecute;
                delete item.CanDesign;
                delete item.CanCreatePage;
                return item;
            });
            this.alPanel.postMessage({ Command: 'LoadObjects', Data: objectView });
        });
    }
    LoadPageDesignCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            //await this.checkLicense();
            let design;
            let data = Object.assign({}, message.Data);
            design = yield this.middlewareService.getPageDesign(data);
            this.alPanel.setTitle(`${data.isPreview === true ? '[Preview] ' : ''}Page ${design.Name}`);
            this.alPanel.postMessage({ Command: 'LoadPageDesign', Data: design });
        });
    }
    LoadPagePartDesignCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            ////await this.checkLicense();
            let data = Object.assign({}, message.Data);
            let design = yield this.middlewareService.getPagePartDesign(data);
            this.alPanel.postMessage({ Command: 'LoadPagePartDesign', Data: design });
        });
    }
    LoadTableDesignCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            //await this.checkLicense();
            let design;
            let data = Object.assign({}, message.Data);
            design = yield this.middlewareService.getTableDesign(data);
            this.alPanel.setTitle(`Table ${design.Name}`);
            this.alPanel.postMessage({ Command: 'LoadTableDesign', Data: design });
        });
    }
    LoadSourceTableDesignCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            //await this.checkLicense();
            let design = null;
            let row = Application_1.Application.objectList.find(f => f.TypeId == al_studio_1.ALObjectType.table && f.Name == message.Data.Name);
            if (row) {
                design = yield this.middlewareService.getTableDesign(row.SymbolData);
            }
            this.alPanel.postMessage({ Command: 'LoadSourceTableDesign', Data: design });
        });
    }
    NewPageCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            //await this.checkLicense();
            yield VSCommandService_1.VSCommandService.executeCommand(VSCommandService_1.VSCommandType.TreeNewPage);
        });
    }
    ObjectDesignerCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield VSCommandService_1.VSCommandService.executeCommand(VSCommandService_1.VSCommandType.ObjectDesigner);
        });
    }
    OpenExtensionCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let objectRow = Application_1.Application.objectList.find(f => f.Type.toLowerCase() == message.Data.Type.toLowerCase() && f.Name == message.Data.Name);
            if (objectRow) {
                yield this.ViewSourceCommand({
                    Command: 'ViewSource',
                    Data: {
                        Index: objectRow.Id,
                        Type: objectRow.TypeId,
                        Name: objectRow.Name
                    }
                });
                this.alPanel.postMessage({ Command: 'OpenExtension', Data: true });
            }
        });
    }
    OpenParameterCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let objectRow = Application_1.Application.objectList.find(f => f.Type.toLowerCase() == message.Data.Type.toLowerCase() && f.Name == message.Data.Name);
            if (objectRow) {
                yield this.OpenCommand({
                    Command: 'Open',
                    Data: {
                        Index: objectRow.Id,
                        Type: objectRow.TypeId,
                        Name: objectRow.Name
                    }
                });
                this.alPanel.postMessage({ Command: 'OpenParameter', Data: true });
            }
        });
    }
    OpenActionCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let runObject = message.Data.Properties.find((f) => f.Name.toLowerCase() == 'runobject');
            if (runObject) {
                let objectRow = Application_1.Application.objectList.find((f) => f.Name == runObject.Value && f.Type.toLowerCase() != 'table');
                yield this.OpenCommand({
                    Command: 'Open', Data: {
                        Index: objectRow.Id,
                        Type: objectRow.TypeId,
                        Name: objectRow.Name
                    }
                });
                this.alPanel.postMessage({ Command: 'OpenAction', Data: true });
            }
            else {
                let data = message.Data.symbolData;
                let objectRow = Application_1.Application.objectList.find((f) => f.Name == data.Name && f.TypeId == data.Type);
                if (objectRow) {
                    if (objectRow.Application != message.Data.Application) {
                        objectRow = Application_1.Application.objectList.find((f) => f.Name == objectRow.TargetObject && (f.Type == objectRow.Type || f.Type == objectRow.Type.replace("extension", "")));
                        if (objectRow) {
                            data = objectRow.SymbolData;
                        }
                    }
                }
                data.IsEvent = true;
                data.SourceAnchor = message.Data.Name.indexOf(" ") != -1 ? `action("${message.Data.Name}"` : `action(${message.Data.Name}`;
                let msg = { Command: 'ViewSource', Data: data };
                yield this.ViewSourceCommand(msg);
                this.alPanel.postMessage({ Command: 'OpenAction', Data: false });
            }
        });
    }
    OpenPropertyCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = message.Data;
            let lookupObjectType = al_studio_1.ALObjectType.table;
            switch (data.EditorType) {
                case al_studio_1.ALPropertyCollectionItemType.TableList:
                    lookupObjectType = al_studio_1.ALObjectType.table;
                    break;
                case al_studio_1.ALPropertyCollectionItemType.PageList:
                    lookupObjectType = al_studio_1.ALObjectType.page;
                    break;
                case al_studio_1.ALPropertyCollectionItemType.ReportList:
                    lookupObjectType = al_studio_1.ALObjectType.report;
                    break;
            }
            let result = Application_1.Application.objectList.find(f => f.TypeId == lookupObjectType && f.Name == data.Value);
            if (result) {
                this.OpenCommand({ Command: 'Open', Data: { Type: result.TypeId, Name: result.Name } });
            }
            this.alPanel.postMessage({ Command: 'OpenProperty', Data: null });
        });
    }
    OpenDocsCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            //await this.checkLicense();
            yield ALStudioPanel_1.ALStudioPanel.open(ALStudioFeature_1.ALStudioFeature.OfficalDocs, { title: `AL Documentation`, Data: message.Data });
        });
    }
    OpenCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let objectRow = Application_1.Application.objectList.find(f => f.TypeId == message.Data.Type && f.Name == message.Data.Name);
            if (objectRow) {
                let designerType = ALStudioFeature_1.ALStudioFeature.PageDesigner;
                let titlePrefix = 'Designer';
                let forceShowSource = false;
                //let advSettings: any = Application.config.advanced;
                switch (objectRow.Type.toLowerCase()) {
                    default:
                        return yield this.ViewSourceCommand({ Data: objectRow.SymbolData });
                    case 'table':
                    case 'tableextension':
                        designerType = ALStudioFeature_1.ALStudioFeature.TableDesigner;
                        titlePrefix = '[Loading] Table';
                        break;
                    case 'page':
                    case 'pageextension':
                        designerType = ALStudioFeature_1.ALStudioFeature.PageDesigner;
                        titlePrefix = '[Loading] Page';
                        break;
                    case 'enum':
                    case 'enumextension':
                        designerType = ALStudioFeature_1.ALStudioFeature.EnumDesigner;
                        titlePrefix = '[Loading] Enum';
                        break;
                    case 'report':
                        designerType = ALStudioFeature_1.ALStudioFeature.ReportDataSetDesigner;
                        Application_1.Application.ui.info(`Report DataSet Designer is planned for future versions.`);
                        forceShowSource = true;
                        break;
                    case 'xmlport':
                        designerType = ALStudioFeature_1.ALStudioFeature.XmlPortDesigner;
                        Application_1.Application.ui.info(`XMLPort Designer is planned for future versions.`);
                        forceShowSource = true;
                        break;
                    case 'controladdin':
                        designerType = ALStudioFeature_1.ALStudioFeature.ControlAddinDesigner;
                        titlePrefix = '[Loading] Add-in';
                        break;
                    case 'codeunit':
                        designerType = ALStudioFeature_1.ALStudioFeature.CodeunitDesigner;
                        titlePrefix = '[Loading] Codeunit';
                        break;
                    case 'interface':
                        designerType = ALStudioFeature_1.ALStudioFeature.InterfaceDesigner;
                        titlePrefix = '[Loading] Interface';
                        break;
                }
                if (message.Data.FromScope === true) {
                    let scopeItem = message.Data.ScopeItem;
                    forceShowSource = scopeItem.IsEvent === true;
                }
                let titlePart = `${titlePrefix.replace('[Loading]', '').trim()} ${objectRow.TargetObject ? objectRow.TargetObject : message.Data.Name}`;
                if (ALStudioPanel_1.ALStudioPanel.showByTitle(titlePart) === true) {
                    return;
                }
                let licenseCheck = yield this.isLicensed();
                if (licenseCheck !== true || forceShowSource === true) {
                    return yield this.ViewSourceCommand({ Data: objectRow.SymbolData, FromScope: message.Data.FromScope, ScopeItem: message.Data.ScopeItem });
                }
                let symbolData = Object.assign({}, objectRow.SymbolData);
                symbolData.Path = symbolData.Path.replace(/\\/g, '\\\\');
                symbolData.Name = message.Data.Name;
                yield ALStudioPanel_1.ALStudioPanel.open(designerType, { title: `${titlePrefix} ${message.Data.Name}`, Data: symbolData }, objectRow.FsPath);
            }
            else {
                Application_1.Application.ui.error(`Object ${message.Data.Name} could not be opened.`);
            }
        });
    }
    PasteCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let contents = yield clipboardy.read();
            this.alPanel.postMessage({ Command: 'Paste', Data: contents });
        });
    }
    PreviewCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            //await this.checkLicense();
            let objectRow = Application_1.Application.objectList.find(f => f.TypeId == message.Data.Type && f.Name == message.Data.Name);
            if (objectRow) {
                let symbolData = Object.assign({}, objectRow.SymbolData);
                symbolData.Path = symbolData.Path.replace(/\\/g, '\\\\');
                symbolData.Name = message.Data.Name;
                yield ALStudioPanel_1.ALStudioPanel.open(ALStudioFeature_1.ALStudioFeature.PageDesigner, { title: `[Loading] Page ${message.Data.Name}`, Data: symbolData, isPreview: true });
            }
            else {
                yield Application_1.Application.ui.error(`Object ${message.Data.Name} could not be opened.`);
            }
        });
    }
    SaveEnumDesignCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            //await this.checkLicense();
            let data = message.Data;
            let result = yield this.middlewareService.saveEnumDesign(data);
            this.alPanel.postMessage({ Command: 'SaveEnumDesign', Data: result });
        });
    }
    SavePageDesignCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            ////await this.checkLicense();
            Application_1.Application.designerEmittedChange = true;
            let design;
            let data = message.Data;
            design = yield this.middlewareService.saveObjectDesign(data);
            this.alPanel.postMessage({ Command: 'SavePageDesign', Data: design });
            //Application.designerEmittedChange = false;
        });
    }
    SaveTableDesignCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            //await this.checkLicense();
            let data = message.Data;
            let result = yield this.middlewareService.saveTableDesign(data);
            this.alPanel.postMessage({ Command: 'SaveTableDesign', Data: result });
        });
    }
    UpdateDesignCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            ////await this.checkLicense();
            Application_1.Application.designerEmittedChange = true;
            let data = JSON.stringify(message.Data);
            let result = yield this.middlewareService.saveObjectDesign(data);
            this.alPanel.postMessage({ Command: 'UpdateDesign', Data: result });
            //Application.designerEmittedChange = false;
        });
    }
    ViewSourceCommand(message) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return __awaiter(this, void 0, void 0, function* () {
            let skipEditor = message.Data.SkipEditor === true;
            let skipLocal = message.Data.SkipLocal === true;
            let objectRow = Application_1.Application.objectList.find(f => f.TypeId == message.Data.Type && (message.Data.Type == al_studio_1.ALObjectType.dotnet ? f.Application == message.Data.Name : f.Name == message.Data.Name));
            if (objectRow) {
                let doc;
                let editor;
                let column = vscode_1.ViewColumn.Active; //ALStudioPanel.instances.length > 0 ? ViewColumn.Beside : ViewColumn.Active;
                if (objectRow.IsLocal === true) {
                    if (skipEditor !== true) {
                        doc = yield vscode_1.workspace.openTextDocument(objectRow.SymbolData.Path);
                        editor = yield vscode_1.window.showTextDocument(doc, column);
                    }
                    else {
                        if (skipLocal === true) {
                            return null;
                        }
                        return new vscode_1.Location(vscode_1.Uri.file(objectRow.SymbolData.Path), new vscode_1.Position((_b = (_a = message.Data) === null || _a === void 0 ? void 0 : _a.Position) === null || _b === void 0 ? void 0 : _b.line, (_d = (_c = message.Data) === null || _c === void 0 ? void 0 : _c.Position) === null || _d === void 0 ? void 0 : _d.character));
                    }
                }
                else {
                    if (objectRow.IsLocal === false) {
                        objectRow.Application = Application_1.Application.activeProject;
                    }
                    let appName = objectRow.Application.replace(/\s/g, '');
                    objectRow.SymbolData.Name = message.Data.Name;
                    objectRow.SymbolData.Application = objectRow.Application;
                    if (message.Data.Position) {
                        objectRow.SymbolData.Position = message.Data.Position;
                        objectRow.SymbolData.Position = message.Data.Position;
                    }
                    let objName = objectRow.Name.replace(/\//g, "");
                    let objFullname = `${objectRow.Type}${objectRow.Id > 0 ? ` ${objectRow.Id} ` : ''}${objName}`;
                    let uri = vscode_1.Uri.parse(`al-studio-preview://allang/${appName}/${objectRow.Type}/${objectRow.Id}/${objectRow.Name}.dal/${objFullname} - ${objectRow.Application}.dal#${JSON.stringify(objectRow.SymbolData)}`);
                    if (skipEditor !== true) {
                        doc = yield vscode_1.workspace.openTextDocument(uri); // calls back into the provider
                        editor = yield vscode_1.window.showTextDocument(doc, { preview: true, viewColumn: column });
                    }
                    else {
                        let startPos = new vscode_1.Position((_f = (_e = message.Data) === null || _e === void 0 ? void 0 : _e.Position) === null || _f === void 0 ? void 0 : _f.line, (_h = (_g = message.Data) === null || _g === void 0 ? void 0 : _g.Position) === null || _h === void 0 ? void 0 : _h.character);
                        if (!message.Data.Length) {
                            return new vscode_1.Location(uri, startPos);
                        }
                        let endPos = new vscode_1.Position((_k = (_j = message.Data) === null || _j === void 0 ? void 0 : _j.Position) === null || _k === void 0 ? void 0 : _k.line, ((_m = (_l = message.Data) === null || _l === void 0 ? void 0 : _l.Position) === null || _m === void 0 ? void 0 : _m.character) + message.Data.Length);
                        return new vscode_1.Location(uri, new vscode_1.Range(startPos, endPos));
                    }
                }
                let methodName = '';
                if (message.FromScope === true) {
                    message.Data.EventName = message.ScopeItem.EventName;
                    message.Data.IsEvent = true;
                }
                if (message.Data.IsEvent === true) {
                    methodName = `${message.Data.EventName}(`;
                }
                else {
                    methodName = `procedure ${message.Data.EventName}(`;
                }
                if (message.Data.SourceAnchor) {
                    methodName = message.Data.SourceAnchor;
                }
                if (message.Data.MethodLookup === true || message.Data.IsEvent === true) {
                    let text = doc.getText();
                    let i = text.indexOf(methodName);
                    if (i !== -1) {
                        let x = doc.positionAt(i);
                        editor.selection = new vscode_1.Selection(x, x);
                        editor.revealRange(new vscode_1.Range(x, x), vscode_1.TextEditorRevealType.InCenter);
                    }
                }
            }
            else {
                yield Application_1.Application.ui.error(`Object ${message.Data.Name} could not be opened.`);
            }
        });
    }
    SavePageScreenshotCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            //await this.checkLicense();
            let data = message.Data.Image;
            let buffer = Buffer.from(data.split(",")[1], 'base64');
            let defaultPath = vscode_1.Uri.file(path_1.join(Application_1.Application.getWorkspacePaths()[0], `${sanitize(message.Data.Name)}.png`));
            let filename = yield Application_1.Application.ui.filepicker({ 'PNG': ['png'] }, 'Save Page screenshot', defaultPath);
            if (!filename) {
                yield Application_1.Application.ui.warn('Screenshot saving cancelled.');
            }
            else {
                yield fs_extra_1.writeFile(filename, buffer);
            }
            this.alPanel.postMessage({ Command: 'SavePageScreenshot', Data: null });
        });
    }
    GetMultiGroupNamesCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = [];
            let names = yield Application_1.Application.ui.input('e.g. General,Invoicing,Shipping,etc...', 'Enter Group names separated by comma.');
            if (names)
                result = names.split(',');
            yield this.alPanel.postMessage({ Command: 'GetMultiGroupNames', Data: result });
        });
    }
    GenerateDocumentationCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkLicense();
            let data = message.Data;
            let buffer = yield this.middlewareService.generateDocumentation(data);
            let defaultPath = vscode_1.Uri.file(path_1.join(Application_1.Application.getWorkspacePaths()[0], `${sanitize(message.Data.Name)}.md`));
            let filename = yield Application_1.Application.ui.filepicker({ 'MarkDown': ['md'] }, 'Save Documentation', defaultPath);
            if (!filename) {
                yield Application_1.Application.ui.warn('Screenshot saving cancelled.');
            }
            else {
                yield fs_extra_1.writeFile(filename, buffer);
            }
            this.alPanel.postMessage({ Command: 'GenerateDocumentation', Data: null });
        });
    }
    BrowseFolderCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let path = yield Application_1.Application.ui.folderpicker('Select AL Workspace Root');
            this.alPanel.postMessage({ Command: 'BrowseFolder', Data: path || '' });
        });
    }
    CreateProjectCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.middlewareService.createProject(message.Data);
            this.alPanel.postMessage({ Command: 'CreateProject', Data: result });
            let uri = vscode_1.Uri.file(result);
            VSCommandService_1.VSCommandService.executeCommand(VSCommandService_1.VSCommandType.OpenFolder, uri);
        });
    }
    CreateObjectCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            Application_1.Application.discoverInProgress = true;
            let objectType = al_studio_1.ALObjectType[message.Data.Type];
            let newName = yield Application_1.Application.ui.input('Object name...', `Enter ${objectType} name`);
            if (!newName) {
                Application_1.Application.discoverInProgress = false;
                Application_1.Application.ui.warn(`Adding new ${objectType} cancelled.`);
                this.alPanel.postMessage({ Command: 'CreateObject', Data: null });
                return;
            }
            let newObject = yield this.middlewareService.createObject(message.Data.Type, message.Data.Project, newName);
            Application_1.Application.discoverInProgress = false;
            yield VSCommandService_1.VSCommandService.localObjectWatcher(newObject.Path, 'add');
            yield this.OpenCommand({ Command: 'OpenCommand', Data: { Type: newObject.Type, Name: newObject.Name } });
            this.alPanel.postMessage({ Command: 'CreateObject', Data: null });
        });
    }
    ExtendObjectCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            Application_1.Application.discoverInProgress = true;
            let newObject = yield this.middlewareService.extendObject(message.Data, Application_1.Application.activeProject);
            Application_1.Application.discoverInProgress = false;
            yield VSCommandService_1.VSCommandService.localObjectWatcher(newObject.Path, 'add');
            this.alPanel.postMessage({ Command: 'ExtendObject', Data: null });
            setTimeout(() => {
                this.OpenCommand({ Command: 'OpenCommand', Data: { Type: newObject.Type, Name: newObject.Name } });
            }, 150);
        });
    }
    AutoCompleteObjectNameCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.middlewareService.autoCompleteObjectName(message.Data.Type, message.Data.SearchParam);
            this.alPanel.postMessage({ Command: 'AutoCompleteObjectName', Data: result });
        });
    }
    AutoCompleteRunObjectNameCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.middlewareService.autoCompleteRunObjectName(message.Data.SearchParam);
            this.alPanel.postMessage({ Command: 'AutoCompleteRunObjectName', Data: result });
        });
    }
    LoadMarkdownCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let isPage = message.Data.IsPage;
            let result = isPage === true ?
                yield this.middlewareService.loadPageDocumentation(message.Data.Url) :
                yield this.middlewareService.loadPropertyDocumentation(message.Data.Url);
            this.alPanel.postMessage({ Command: 'LoadMarkdown', Data: result });
        });
    }
    LoadMarkdownTocCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.middlewareService.loadDocumentationToc();
            this.alPanel.postMessage({ Command: 'LoadMarkdownToc', Data: result });
        });
    }
    LoadMarkdownIndexCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.middlewareService.loadDocumentationIndex();
            this.alPanel.postMessage({ Command: 'LoadMarkdownIndex', Data: result });
        });
    }
    LoadPropertyUrlCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.middlewareService.loadPropertyUrl(message.Data);
            this.alPanel.postMessage({ Command: 'LoadPropertyUrl', Data: null });
            if (result) {
                let checkExt = vscode_1.extensions.getExtension('auchenberg.vscode-browser-preview');
                if (checkExt) {
                    if (!checkExt.isActive) {
                        yield checkExt.activate();
                    }
                    VSCommandService_1.VSCommandService.executeCommand('browser-preview.openPreview', result);
                }
                else {
                    vscode_1.env.openExternal(vscode_1.Uri.parse(result));
                }
            }
        });
    }
    SetActiveProjectCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            Application_1.Application.activeProject = message.Data.Name;
            let newWorkspacePath = message.Data.Path;
            yield this.alLanguageApiService.setActiveWorkspace(newWorkspacePath);
            this.alPanel.postMessage({ Command: 'SetActiveProject', Data: null });
        });
    }
    RunProjectCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let newWorkspacePath = message.Data.Path;
            let buildType = message.Data.BuildType;
            let progressMsg = 'Building AL Package';
            switch (buildType) {
                case al_studio_1.BuildType.SnapshotInitialize:
                    progressMsg = 'Recording new Snapshot';
                    break;
                case al_studio_1.BuildType.SnapshotFinish:
                    progressMsg = 'Finishing Snapshot';
                    break;
                case al_studio_1.BuildType.SnapshotReplay:
                    progressMsg = 'Getting Snapshots';
                    break;
                case al_studio_1.BuildType.Snapshots:
                    if (yield this.isLicensed()) {
                        return this.SnapshotsCommand({ Command: 'Snapshot', Data: null });
                    }
                    progressMsg = 'Getting Snapshots';
                    break;
            }
            yield Application_1.Application.ui.progress(`${progressMsg}: ${message.Data.Name}...`, (progress, token) => __awaiter(this, void 0, void 0, function* () {
                token.onCancellationRequested(() => {
                    Application_1.Application.log.warn("Building cancelled.");
                });
                if (buildType == al_studio_1.BuildType.DownloadSymbols) {
                    this.alLanguageApiService.launchDebugger(newWorkspacePath, buildType, message.Data.Snapshot);
                }
                else {
                    yield this.alLanguageApiService.launchDebugger(newWorkspacePath, buildType, message.Data.Snapshot);
                    Application_1.Application.log.info(`${al_studio_1.BuildType[buildType]} operation finished.`);
                    if (buildType == al_studio_1.BuildType.SnapshotInitialize) {
                        Application_1.Application.ui.info(`Snapshot recording has been initialized.`);
                    }
                    if (buildType == al_studio_1.BuildType.SnapshotFinish) {
                        Application_1.Application.ui.info(`Snapshot has been recorded and downloaded.`);
                    }
                }
                return true;
            }));
            this.alPanel.postMessage({ Command: 'RunProject', Data: null });
        });
    }
    AddToScopeCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let scopes = this.alScopeService.scopes.map(scope => `${scope.Name}${scope.TaskID ? ', ' + scope.TaskID : ''}`);
            let value = yield Application_1.Application.ui.quickPickSingle('Select a Scope...', scopes);
            if (value) {
                let name = value.split(',')[0];
                for (let m of message.Data) {
                    this.alScopeService.addToScope(name, m.TypeId, m.Name, m.EventName, m.EventType);
                }
                this.alScopeService.save();
            }
            this.alPanel.postMessage({ Command: 'AddToScope', Data: value ? true : false });
        });
    }
    LoadTranslationsCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            Application_1.Application.ui.info(`Translation Manager is under development and currently read-only.`);
            let translations = yield this.middlewareService.getTranslations(Application_1.Application.getWorkspacePaths());
            this.alPanel.postMessage({ Command: 'LoadTranslations', Data: translations });
        });
    }
    OpenTranslationsCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkLicense();
            VSCommandService_1.VSCommandService.translations();
            this.alPanel.postMessage({ Command: 'OpenTranslations', Data: null });
        });
    }
    OpenTableFieldsCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkLicense();
            VSCommandService_1.VSCommandService.tableFields();
            this.alPanel.postMessage({ Command: 'OpenTableFields', Data: null });
        });
    }
    GetConfirmCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield Application_1.Application.ui.confirm(message.Data);
            this.alPanel.postMessage({ Command: 'GetConfirm', Data: result == 'Yes' });
        });
    }
    GetUserControlsCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = Application_1.Application.objectList.filter(f => f.TypeId == al_studio_1.ALObjectType.controladdin);
            this.alPanel.postMessage({ Command: 'GetUserControls', Data: result });
        });
    }
    GetPagePartsCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = Application_1.Application.objectList
                .filter(f => f.TypeId == al_studio_1.ALObjectType.page &&
                f.Properties.find((x) => x.Name == 'PageType' && ['CardPart', 'ListPart'].indexOf(x.Value) != -1));
            result = result.map(m => {
                m.SubType = m.Properties.find((x) => x.Name == 'PageType').Value;
                return m;
            });
            this.alPanel.postMessage({ Command: 'GetPageParts', Data: result });
        });
    }
    LoadTransferfieldRulesCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.middlewareService.getTransferfieldRules(Application_1.Application.getWorkspacePaths());
            this.alPanel.postMessage({ Command: 'LoadTransferfieldRules', Data: result });
        });
    }
    LoadTableFieldsCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.middlewareService.getTableFields();
            this.alPanel.postMessage({ Command: 'LoadTableFields', Data: result });
        });
    }
    LoadLaunchConfigsCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.middlewareService.getLaunchConfigs(Application_1.Application.getWorkspacePaths());
            this.alPanel.postMessage({ Command: 'LoadLaunchConfigs', Data: result });
        });
    }
    RunObjectCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = '';
            let project = null;
            let result = yield this.middlewareService.getLaunchUrl(Application_1.Application.activeProject, message.Data, Application_1.Application.config.advanced.traefikInstancePostfix);
            if (result.length == 1) {
                url = result[0].Url || '';
                project = result[0].Project;
            }
            if (result.length > 1) {
                project = result[0].Project;
                let items = result.map(m => {
                    return {
                        label: m.Name,
                        detail: m.Url,
                    };
                });
                let urlItem = yield Application_1.Application.ui.quickPickSingle(`Please choose the server for ${project}:`, items);
                url = urlItem ? urlItem.detail : '';
            }
            if (result.length == 0) {
                Application_1.Application.ui.warn(`No Launch configuration was found for ${project || Application_1.Application.activeProject}.`);
            }
            else {
                if (url != '')
                    vscode_1.env.openExternal(vscode_1.Uri.parse(url));
            }
            this.alPanel.postMessage({ Command: 'RunObject', Data: null });
        });
    }
    CopyEventsCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(message);
            this.alPanel.postMessage({ Command: 'CopyEvents', Data: true });
        });
    }
    LoadReportLayoutSourceCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            message.Data.Source = true;
            message.Data.Layout = al_studio_1.ReportLayoutType.RDLC;
            yield this.LoadReportLayoutCommand(message);
            this.alPanel.postMessage({ Command: 'LoadReportLayoutSource', Data: null });
        });
    }
    SearchCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield this.middlewareService.search(message.Data.Search, message.Data.Categories, true);
            this.alPanel.postMessage({ Command: 'Search', Data: data });
        });
    }
    LoadReportLayoutCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.middlewareService.getReportLayout(message.Data.Name, message.Data.Layout);
            let path = vscode_1.Uri.file(result.FilePath);
            switch (result.Type) {
                case al_studio_1.ReportLayoutType.RDLC:
                    if (message.Data.Source === true) {
                        if (result.IsLocal === true) {
                            let doc = yield vscode_1.workspace.openTextDocument(path);
                            vscode_1.window.showTextDocument(doc);
                        }
                        else {
                            let doc = yield vscode_1.workspace.openTextDocument({ language: 'xml', content: result.Content });
                            vscode_1.window.showTextDocument(doc);
                        }
                    }
                    else {
                        open(result.FilePath);
                    }
                    break;
                case al_studio_1.ReportLayoutType.Word:
                    open(result.FilePath);
                    break;
            }
            this.alPanel.postMessage({ Command: 'LoadReportLayout', Data: null });
        });
    }
    /*
    View<->Panel data exchange commands
    */
    SidebarAutoFilterCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let dashboard = ALStudioPanel_1.ALStudioPanel.instances.find(f => f.feature == ALStudioFeature_1.ALStudioFeature.Dashboard);
            if (dashboard) {
                dashboard.postMessage({ Command: 'SidebarAutoFilter', Data: message.Data });
            }
            this.alPanel.postMessage({ Command: 'SidebarAutoFilter', Data: message.Data });
        });
    }
    SidebarLocalFilterCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let dashboard = ALStudioPanel_1.ALStudioPanel.instances.find(f => f.feature == ALStudioFeature_1.ALStudioFeature.Dashboard);
            if (dashboard) {
                dashboard.postMessage({ Command: 'SidebarLocalFilter', Data: message.Data });
            }
            this.alPanel.postMessage({ Command: 'SidebarLocalFilter', Data: message.Data });
        });
    }
    SidebarProjectFilterCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let dashboard = ALStudioPanel_1.ALStudioPanel.instances.find(f => f.feature == ALStudioFeature_1.ALStudioFeature.Dashboard);
            if (dashboard) {
                dashboard.postMessage({ Command: 'SidebarProjectFilter', Data: message.Data });
            }
            this.alPanel.postMessage({ Command: 'SidebarProjectFilter', Data: message.Data });
        });
    }
    ToggleSidebarOnHomeCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let dashboard = ALStudioPanel_1.ALStudioPanel.instances.find(f => f.feature == ALStudioFeature_1.ALStudioFeature.Dashboard);
            if (dashboard) {
                dashboard.postMessage({ Command: 'ToggleSidebarOnHome', Data: message.Data });
            }
        });
    }
    ALHomeVisibleInitCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let dashboard = ALStudioPanel_1.ALStudioPanel.instances.find(f => f.feature == ALStudioFeature_1.ALStudioFeature.Dashboard);
            if (dashboard) {
                this.alPanel.postMessage({ Command: 'ALHomeVisibleInit', Data: dashboard.panelVisible });
            }
        });
    }
}
exports.ALStudioPanelCommandService = ALStudioPanelCommandService;
//# sourceMappingURL=ALStudioPanelCommandService.js.map