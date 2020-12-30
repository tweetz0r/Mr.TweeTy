'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
/**
 * Main command to create a new project from a template.
 * This command can be invoked by the Command Palette or in a folder context menu on the explorer view.
 * @export
 * @param {ProjectTemplatesPlugin} templateManager
 * @param {*} args
 */
function run(templateManager, args) {
    return __awaiter(this, void 0, void 0, function* () {
        // get workspace folder
        let workspace = yield templateManager.selectWorkspace(args);
        if (!workspace) {
            vscode.window.showErrorMessage("No workspace selected");
            return;
        }
        // load latest configuration
        templateManager.updateConfiguration(vscode.workspace.getConfiguration('projectTemplates'));
        // create project
        templateManager.createFromTemplate(workspace).then((template) => {
            if (template) {
                vscode.window.showInformationMessage("Created project from template '" + template + "'");
            }
        }, (reason) => {
            vscode.window.showErrorMessage("Failed to create project from template: " + reason);
        });
    });
}
exports.run = run;
//# sourceMappingURL=createProjectFromTemplateCommand.js.map