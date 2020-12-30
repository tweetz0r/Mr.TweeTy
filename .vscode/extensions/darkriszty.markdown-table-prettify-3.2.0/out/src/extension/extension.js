'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const prettyfierFactory_1 = require("./prettyfierFactory");
// This method is called when the extension is activated.
// The extension is activated the very first time the command is executed.
function activate(context) {
    const MD_MODE = { language: "markdown" };
    const command = "markdownTablePrettify.prettifyTables";
    context.subscriptions.push(vscode.languages.registerDocumentRangeFormattingEditProvider(MD_MODE, prettyfierFactory_1.getDocumentRangePrettyfier()), vscode.languages.registerDocumentFormattingEditProvider(MD_MODE, prettyfierFactory_1.getDocumentPrettyfier()), vscode.commands.registerTextEditorCommand(command, textEditor => prettyfierFactory_1.getDocumentPrettyfierCommand().prettifyDocument(textEditor)));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map