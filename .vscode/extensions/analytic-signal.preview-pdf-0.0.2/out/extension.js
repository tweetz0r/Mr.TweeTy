"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const PDFEditorProvider_1 = require("./PDFEditorProvider");
function activate(context) {
    //
    // register custom editor provider:
    //
    context.subscriptions.push(PDFEditorProvider_1.PDFEditorProvider.register(context));
    //
    // register open custom editor command (not used):
    //
    context.subscriptions.push(vscode.commands.registerCommand("analyticsignal.preview-pdf-open", (uri) => {
        vscode.commands.executeCommand('vscode.open', uri, { preview: false });
    }));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map