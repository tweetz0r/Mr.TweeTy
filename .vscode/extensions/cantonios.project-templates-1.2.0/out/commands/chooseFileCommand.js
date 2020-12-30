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
 * Main command to choose a file
 * @export
 * @param {TemplateManager} templateManager
 * @param {*} args
 */
function run(templateManager, args) {
    return __awaiter(this, void 0, void 0, function* () {
        vscode.window.showOpenDialog({
            canSelectFiles: false,
            canSelectFolders: true,
            canSelectMany: false
        }).then(selected => {
            if (selected) {
                for (let uri of selected) {
                    console.log(uri);
                }
            }
        }, reason => {
            console.error("Failed: " + reason);
        });
    });
}
exports.run = run;
//# sourceMappingURL=chooseFileCommand.js.map