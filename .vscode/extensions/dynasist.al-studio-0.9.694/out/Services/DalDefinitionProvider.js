"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ALStudioPanelCommandService_1 = require("./ALStudioPanelCommandService");
const vscode_1 = require("vscode");
const Application_1 = require("../Application");
const al_studio_1 = require("../typings/al-studio");
class DalDefinitionProvider {
    provideDefinition(document, position, token) {
        var _a, _b;
        if (token.isCancellationRequested) {
            return null;
        }
        if (((_a = vscode_1.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.uri.toString()) != document.uri.toString())
            return null;
        if (((_b = vscode_1.window.activeTextEditor) === null || _b === void 0 ? void 0 : _b.selection.active.line) != position.line)
            return null;
        Application_1.Application.log.debug('alStudioDalDef', [document, position]);
        let commandService = Application_1.Application.container.get(ALStudioPanelCommandService_1.ALStudioPanelCommandService);
        let selectedLine = document.lineAt(position);
        let checkTxt = selectedLine.text;
        let message = null;
        // test for properties
        message = this._navigateProperty(checkTxt, position);
        // test for variable definition
        if (message === null) {
            message = this._navigateVariable(checkTxt, position);
        }
        if (message !== null) {
            //command.execute(message);
            message.Data.SkipEditor = true;
            let location = commandService.ViewSourceCommand(message);
            return Promise.resolve(location);
        }
        return null;
    }
    _navigateVariable(checkTxt, position) {
        let part = checkTxt;
        let startPos = 0, endPos = -1, length = part.length;
        for (let i = position.character; i >= 0; i--) {
            if ([',', ';'].indexOf(part[i]) != -1) {
                startPos = i;
                break;
            }
        }
        for (let i = position.character; i < length; i++) {
            if ([',', ';', ')'].indexOf(part[i]) != -1) {
                endPos = i;
                break;
            }
        }
        if (endPos === -1) {
            return null;
        }
        part = checkTxt.substring(startPos, endPos);
        let pattern = /(\:|;).*?(codeunit|page|dotnet|enum|interface|query|report|record|xmlport|profile|controladdin)\s?(.*)/gmi;
        let found = pattern.exec(part);
        if (found && found.length > 2) {
            let type = found[2].replace(/record/gi, 'table').toLowerCase();
            let typeId = this.getObjecType(type);
            let name = Application_1.Application.replaceAll(found[3], '"', '');
            let message = {
                Command: 'ViewSource',
                Data: {
                    Type: typeId,
                    Name: name
                }
            };
            return message;
        }
        return null;
    }
    _navigateProperty(checkTxt, position) {
        let pattern = /(.*?)\s+\=\s+(.*?)\;$/gmi;
        let found = pattern.exec(checkTxt);
        if (found && found.length > 2) {
            let propName = found[1].trim().toLowerCase();
            let propMap = this._getSupportedPropertyMap();
            if (!Object.keys(propMap).find(f => f == propName)) {
                return null;
            }
            let type = propMap[propName];
            let name = Application_1.Application.replaceAll(found[2], '"', '').trim();
            if (propName == 'tablerelation') {
                let parts = found[2].split('".');
                name = Application_1.Application.replaceAll(parts[0], '"', '').trim();
            }
            let message = {
                Command: 'ViewSource',
                Data: {
                    Type: type,
                    Name: name
                }
            };
            return message;
        }
        return null;
    }
    _getSupportedPropertyMap() {
        return {
            sourcetable: al_studio_1.ALObjectType.table,
            tablerelation: al_studio_1.ALObjectType.table,
            cardpageid: al_studio_1.ALObjectType.page,
            lookuppageid: al_studio_1.ALObjectType.page,
            drilldownpageid: al_studio_1.ALObjectType.page
        };
    }
    getObjecType(value) {
        return this._getEnumKeyByEnumValue(al_studio_1.ALObjectType, value);
    }
    _getEnumKeyByEnumValue(typeEnum, enumValue) {
        let keys = Object.keys(typeEnum).filter(x => typeEnum[x] == enumValue);
        return keys.length > 0 ? keys[0] : null;
    }
}
exports.DalDefinitionProvider = DalDefinitionProvider;
//# sourceMappingURL=DalDefinitionProvider.js.map