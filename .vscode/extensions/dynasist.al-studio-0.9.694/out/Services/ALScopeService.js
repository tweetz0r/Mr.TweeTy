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
const aurelia_dependency_injection_1 = require("aurelia-dependency-injection");
const Application_1 = require("../Application");
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
let ALScopeService = class ALScopeService {
    constructor() {
        this.scopeFilePath = '';
        this.scopes = [];
        this.init();
    }
    init() {
        let mainPath = Application_1.Application.getVsCodeFolder();
        if (!mainPath)
            return false;
        this.scopeFilePath = path_1.join(mainPath, 'alstudio.scopes.json');
        if (!fs_extra_1.existsSync(this.scopeFilePath)) {
            //ensureFileSync(this.scopeFilePath);
            let scopeInit = [];
            //writeJSONSync(this.scopeFilePath, scopeInit);
            this.scopes = scopeInit;
        }
        else {
            this.scopes = fs_extra_1.readJsonSync(this.scopeFilePath);
        }
        return true;
    }
    toggleScopeState(scopeName) {
        let scope = this.getScope(scopeName);
        if (!scope)
            return;
        scope.IsActive = !scope.IsActive;
    }
    resetActiveScope(scopeName) {
        for (let scope of this.scopes) {
            scope.IsActive = false;
        }
    }
    createScope(scopeName, taskId, objs) {
        let scope = { Name: scopeName, TaskID: taskId, Objects: [], IsActive: false };
        if (objs) {
            scope.Objects = JSON.parse(JSON.stringify(objs));
        }
        this.scopes.push(scope);
    }
    updateScope(scopeName, taskId) {
        let scope = this.getScope(scopeName);
        if (!scope)
            return;
        scope.Name = scopeName;
        scope.TaskID = taskId;
    }
    deleteScope(scopeName) {
        let scope = this.getScope(scopeName);
        if (!scope)
            return;
        this.scopes.splice(this.scopes.indexOf(scope), 1);
    }
    addToScope(scopeName, objectType, objectName, eventName, eventType) {
        let scope = this.getScope(scopeName);
        if (!scope)
            return;
        scope.Objects.push({
            Type: objectType,
            Name: objectName,
            EventName: eventName,
            EventType: eventType,
            IsEvent: (eventName && eventName.length > 0 ? true : false)
        });
    }
    removeFromScope(scopeName, objectType, objectName, eventName) {
        let scope = this.getScope(scopeName);
        if (!scope)
            return;
        let objIndex = scope.Objects.findIndex(f => {
            var _a;
            return f.Type === objectType &&
                f.Name.toLowerCase() === objectName.toLowerCase() &&
                (eventName && eventName.length > 0 ? eventName.toLowerCase() === ((_a = f.EventName) === null || _a === void 0 ? void 0 : _a.toLowerCase()) : true);
        });
        if (objIndex === -1)
            return;
        scope.Objects.splice(objIndex, 1);
    }
    getScope(scopeName) {
        let scope = this.scopes.find(f => f.Name === scopeName);
        return scope;
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            fs_extra_1.ensureFileSync(this.scopeFilePath);
            yield fs_extra_1.writeJSON(this.scopeFilePath, this.scopes);
        });
    }
};
ALScopeService = __decorate([
    aurelia_dependency_injection_1.singleton(),
    __metadata("design:paramtypes", [])
], ALScopeService);
exports.ALScopeService = ALScopeService;
class ALScope {
    constructor() {
        this.Name = '';
        this.TaskID = '';
        this.IsActive = false;
        this.Objects = [];
    }
}
exports.ALScope = ALScope;
class ALScopeObject {
    constructor() {
        this.Name = '';
        this.IsEvent = false;
    }
}
exports.ALScopeObject = ALScopeObject;
//# sourceMappingURL=ALScopeService.js.map