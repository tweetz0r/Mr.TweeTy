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
const MiddlewareService_1 = require("./MiddlewareService");
const aurelia_dependency_injection_1 = require("aurelia-dependency-injection");
let ALProjectService = class ALProjectService {
    constructor(middlewareService) {
        this.middlewareService = middlewareService;
    }
    selectFolder() {
        return __awaiter(this, void 0, void 0, function* () {
            let path = yield Application_1.Application.ui.folderpicker('Select AL Project folder');
            if (!path) {
                return;
            }
            return path;
        });
    }
    generate(workspaceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.middlewareService) {
            }
        });
    }
};
ALProjectService = __decorate([
    aurelia_dependency_injection_1.singleton(),
    aurelia_dependency_injection_1.autoinject(),
    __metadata("design:paramtypes", [MiddlewareService_1.MiddlewareService])
], ALProjectService);
exports.ALProjectService = ALProjectService;
var LaunchConfigAuthentication;
(function (LaunchConfigAuthentication) {
    LaunchConfigAuthentication[LaunchConfigAuthentication["UserPassword"] = 0] = "UserPassword";
    LaunchConfigAuthentication[LaunchConfigAuthentication["Windows"] = 1] = "Windows";
    LaunchConfigAuthentication[LaunchConfigAuthentication["AAD"] = 2] = "AAD";
})(LaunchConfigAuthentication = exports.LaunchConfigAuthentication || (exports.LaunchConfigAuthentication = {}));
var ALProjectTarget;
(function (ALProjectTarget) {
    ALProjectTarget[ALProjectTarget["Internal"] = 0] = "Internal";
    ALProjectTarget[ALProjectTarget["Extension"] = 1] = "Extension";
    ALProjectTarget[ALProjectTarget["OnPrem"] = 2] = "OnPrem";
    ALProjectTarget[ALProjectTarget["Cloud"] = 3] = "Cloud";
})(ALProjectTarget = exports.ALProjectTarget || (exports.ALProjectTarget = {}));
var RuntimeVersion;
(function (RuntimeVersion) {
    RuntimeVersion[RuntimeVersion["0.1 Dynamics NAV 2018"] = 0] = "0.1 Dynamics NAV 2018";
    RuntimeVersion[RuntimeVersion["1.0 Business Central Spring 18 Release"] = 1] = "1.0 Business Central Spring 18 Release";
    RuntimeVersion[RuntimeVersion["2.0 Business Central Fall 18 Release"] = 2] = "2.0 Business Central Fall 18 Release";
    RuntimeVersion[RuntimeVersion["3.0 Business Central Spring 19 Release"] = 3] = "3.0 Business Central Spring 19 Release";
    RuntimeVersion[RuntimeVersion["4.0 Business Central 2019 Release Wave 2"] = 4] = "4.0 Business Central 2019 Release Wave 2";
    RuntimeVersion[RuntimeVersion["5.0 Business Central 2020 Release Wave 1"] = 5] = "5.0 Business Central 2020 Release Wave 1";
})(RuntimeVersion = exports.RuntimeVersion || (exports.RuntimeVersion = {}));
//# sourceMappingURL=ALProjectService.js.map