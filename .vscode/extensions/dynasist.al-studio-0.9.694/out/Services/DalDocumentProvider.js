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
const Application_1 = require("./../Application");
const MiddlewareService_1 = require("./MiddlewareService");
const vscode_1 = require("vscode");
//import { ALObjectType } from '../typings/al-studio';
class DalDocumentProvider {
    constructor() {
        this.loadedSymbols = [];
        // emitter and its event
        this.onDidChangeEmitter = new vscode_1.EventEmitter();
        this.onDidChange = this.onDidChangeEmitter.event;
    }
    provideTextDocumentContent(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            let objectRow;
            try {
                objectRow = JSON.parse(uri.fragment);
            }
            catch (ex) {
                return '';
            }
            /*await Application.ui.progress(`Loading source for ${ALObjectType[objectRow.Type]} ${objectRow.Name}`, async (progress, token) => {
                token.onCancellationRequested(() => {
                    Application.log.warn("Source code navigation cancelled.");
                });
    
                let middlewareService = Application.container.get(MiddlewareService);
                result = await middlewareService.getSymbolSource(objectRow);
    
                await Application.sleep(10);
    
                return true;
            });*/
            yield Application_1.Application.sleep(10);
            let check = this.loadedSymbols.find(f => f.Type == objectRow.Type && f.Name == objectRow.Name);
            if (check) {
                return check.Content;
            }
            let middlewareService = Application_1.Application.container.get(MiddlewareService_1.MiddlewareService);
            let result = yield middlewareService.getSymbolSource(objectRow);
            check = this.loadedSymbols.find(f => f.Type == objectRow.Type && f.Name == objectRow.Name);
            if (!check) {
                this.loadedSymbols.push({ Type: objectRow.Type, Name: objectRow.Name, Content: result });
                return result;
            }
            return check.Content;
        });
    }
}
exports.DalDocumentProvider = DalDocumentProvider;
//# sourceMappingURL=DalDocumentProvider.js.map