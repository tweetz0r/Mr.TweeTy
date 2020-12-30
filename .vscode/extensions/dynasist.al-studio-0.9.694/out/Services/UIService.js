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
const aurelia_dependency_injection_1 = require("aurelia-dependency-injection");
const vscode_1 = require("vscode");
let UIService = class UIService {
    confirm(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield vscode_1.window.showWarningMessage(message, { modal: true }, 'Yes', 'No');
        });
    }
    info(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield vscode_1.window.showInformationMessage(message);
        });
    }
    warn(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield vscode_1.window.showWarningMessage(message);
        });
    }
    error(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield vscode_1.window.showErrorMessage(message);
        });
    }
    progress(message, task, location, cancellable) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield vscode_1.window.withProgress({
                location: location || vscode_1.ProgressLocation.Notification,
                title: message,
                cancellable: cancellable
            }, task);
        });
    }
    filepicker(filters, label, defaultUri) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let uri = yield vscode_1.window.showSaveDialog({ filters: filters, saveLabel: label, defaultUri: defaultUri });
            return (_a = uri) === null || _a === void 0 ? void 0 : _a.fsPath;
        });
    }
    folderpicker(label, defaultUri) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let uri = yield vscode_1.window.showOpenDialog({
                defaultUri: defaultUri,
                openLabel: label,
                canSelectFiles: false,
                canSelectFolders: true,
                canSelectMany: false
            });
            return (_a = uri[0]) === null || _a === void 0 ? void 0 : _a.fsPath;
        });
    }
    input(placeHolder, prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield vscode_1.window.showInputBox({ placeHolder: placeHolder, prompt: prompt });
            return result;
        });
    }
    quickPickSingle(placeHolder, items) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield vscode_1.window.showQuickPick(items, { canPickMany: false, ignoreFocusOut: true, placeHolder: placeHolder });
            return result;
        });
    }
};
UIService = __decorate([
    aurelia_dependency_injection_1.singleton(true)
], UIService);
exports.UIService = UIService;
//# sourceMappingURL=UIService.js.map