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
const al_studio_1 = require("./../typings/al-studio");
const MiddlewareService_1 = require("./MiddlewareService");
const vscode_1 = require("vscode");
const Application_1 = require("../Application");
const ALStudioPanelCommandService_1 = require("./ALStudioPanelCommandService");
class EventPublisherDefinitionProvider {
    provideDefinition(document, position, token) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (token.isCancellationRequested) {
                return null;
            }
            if (((_a = vscode_1.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.uri.toString()) != document.uri.toString())
                return null;
            if (((_b = vscode_1.window.activeTextEditor) === null || _b === void 0 ? void 0 : _b.selection.active.line) != position.line)
                return null;
            let selectedLine = document.lineAt(position);
            let checkTxt = selectedLine.text;
            if (checkTxt.indexOf("EventSubscriber") == -1) {
                return null;
            }
            let args = checkTxt.split(',');
            let eventNamePos = checkTxt.indexOf(args[2].trim());
            if (eventNamePos == -1) {
                return null;
            }
            let start = eventNamePos;
            let end = eventNamePos + args[2].trim().length;
            if (position.character < start || position.character > end)
                return null;
            try {
                let middlewareService = Application_1.Application.container.get(MiddlewareService_1.MiddlewareService);
                let result = yield middlewareService.getEventPublisherLocation(document.getText(), checkTxt);
                if (!result) {
                    return null;
                }
                let commandService = Application_1.Application.container.get(ALStudioPanelCommandService_1.ALStudioPanelCommandService);
                let typeId = this.getObjecType(result.TargetObjectType);
                let message = {
                    Command: 'ViewSource',
                    Data: {
                        Type: typeId,
                        Name: result.TargetObject,
                        MethodLookup: true,
                        EventName: result.EventName,
                        SkipEditor: true,
                        Position: result.Position
                    }
                };
                let loc = yield commandService.ViewSourceCommand(message);
                return loc;
            }
            catch (_c) {
                return null;
            }
        });
    }
    getObjecType(value) {
        return this._getEnumKeyByEnumValue(al_studio_1.ALObjectType, value);
    }
    _getEnumKeyByEnumValue(typeEnum, enumValue) {
        let keys = Object.keys(typeEnum).filter(x => typeEnum[x] == enumValue);
        return keys.length > 0 ? keys[0] : null;
    }
}
exports.EventPublisherDefinitionProvider = EventPublisherDefinitionProvider;
//# sourceMappingURL=EventPublisherDefinitionProvider.js.map