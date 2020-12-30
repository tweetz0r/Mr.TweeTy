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
const al_studio_1 = require("./../typings/al-studio");
const ALLanguageApiService_1 = require("./ALLanguageApiService");
//import { ALStudioPanel } from './../ALStudioPanel';
const aurelia_dependency_injection_1 = require("aurelia-dependency-injection");
const Application_1 = require("./../Application");
const vscode_1 = require("vscode");
const MiddlewareService_1 = require("./MiddlewareService");
let ExternalAPIService = class ExternalAPIService {
    constructor() {
    }
    getNextId(type, projectNameOrFilePath) {
        return __awaiter(this, void 0, void 0, function* () {
            let service = Application_1.Application.container.get(MiddlewareService_1.MiddlewareService);
            let newId = yield service.getNextId(type, projectNameOrFilePath);
            return newId;
        });
    }
    get isWorkspaceScanned() {
        return Application_1.Application.initialDiscoveryFinished === true;
    }
    get onWorkspaceScanned() {
        return this._onWorkspaceScanned;
    }
    getObjects() {
        let objectView = Application_1.Application.objectList.map((m) => {
            let item = Object.assign({}, m);
            delete item.SymbolData;
            delete item.CanExecute;
            delete item.CanDesign;
            delete item.CanCreatePage;
            return item;
        });
        return objectView;
    }
    getSymbolUri(type, name, standardFormat = false) {
        let result = null;
        let objectRow = Application_1.Application.objectList.find(f => f.ItemType == al_studio_1.CollectorItemType.Object && f.TypeId == type && f.Name == name);
        if (objectRow) {
            objectRow.SymbolData.Name = objectRow.Name;
            objectRow.SymbolData.Application = objectRow.Application;
            if (standardFormat === true) {
                result = vscode_1.Uri.parse(`al-preview://allang/${objectRow.Application}/${objectRow.Type}/${objectRow.Id}/${encodeURIComponent(objectRow.Name)}.dal`);
            }
            else {
                result = vscode_1.Uri.parse(`al-studio-preview://allang/${objectRow.Application}/${objectRow.Type}/${objectRow.Id}/${objectRow.Name}/${objectRow.Type}${objectRow.Id > 0 ? ` ${objectRow.Id} ` : ''}${objectRow.Name.replace(/\//g, "")} - ${objectRow.Application}.dal#${JSON.stringify(objectRow.SymbolData)}`);
            }
        }
        return result;
    }
    getALLanguageApiService() {
        return new ALLanguageApiService_1.ALLanguageApiService();
    }
};
ExternalAPIService = __decorate([
    aurelia_dependency_injection_1.singleton(true),
    __metadata("design:paramtypes", [])
], ExternalAPIService);
exports.ExternalAPIService = ExternalAPIService;
//# sourceMappingURL=ExternalAPIService.js.map