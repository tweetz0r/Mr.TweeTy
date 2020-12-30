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
const Application_1 = require("../Application");
const ALStudioPanelCommandService_1 = require("./ALStudioPanelCommandService");
const MiddlewareService_1 = require("./MiddlewareService");
class SymbolReferenceProvider {
    provideReferences(document, position, context, token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (token.isCancellationRequested) {
                return null;
            }
            let wordPos = document.getWordRangeAtPosition(position);
            let txt = document.getText(wordPos);
            let commandService = Application_1.Application.container.get(ALStudioPanelCommandService_1.ALStudioPanelCommandService);
            let middlewareService = Application_1.Application.container.get(MiddlewareService_1.MiddlewareService);
            let result = yield middlewareService.getReferencedLines(txt);
            let locations = [];
            for (let r of result) {
                if (token.isCancellationRequested) {
                    return null;
                }
                let message = {
                    Command: 'ViewSource',
                    Data: {
                        Type: r.Type,
                        Name: r.Name,
                        SkipEditor: true,
                        SkipLocal: true,
                        Position: r.Position,
                        Length: txt.length
                    }
                };
                let loc = yield commandService.ViewSourceCommand(message);
                if (loc) {
                    locations.push(loc);
                }
            }
            console.log('SymbolReferenceProvider', locations);
            return locations;
        });
    }
}
exports.SymbolReferenceProvider = SymbolReferenceProvider;
//# sourceMappingURL=SymbolReferenceProvider.js.map