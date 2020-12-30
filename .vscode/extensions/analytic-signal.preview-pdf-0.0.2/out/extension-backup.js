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
exports.deactivate = exports.activate2 = exports.activate = void 0;
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
function activate(context) {
    // Register our custom editor providers
    context.subscriptions.push(HTMLPreviewEditorProvider.register(context));
}
exports.activate = activate;
function activate2(context) {
    let disposable = vscode.commands.registerCommand('analyticsignal-preview.start', (uri) => {
        const panel = vscode.window.createWebviewPanel('analyticsignal-preview', `${path.basename(uri.fsPath)}`, vscode.ViewColumn.One, {
            enableScripts: true,
            retainContextWhenHidden: false
        });
        getWebviewContent(panel.webview, uri, true);
    });
    context.subscriptions.push(disposable);
    vscode.window.registerWebviewPanelSerializer('analyticsignal-preview', new PreviewSerializer());
}
exports.activate2 = activate2;
function deactivate() { }
exports.deactivate = deactivate;
function getWebviewContent(webview, uri, fill) {
    function setState(state) {
        var acquireVsCodeApi;
        const vs = acquireVsCodeApi();
        vs.setState(state);
    }
    let state = uri;
    if (fill === true) {
        webview.html = `<!DOCTYPE html>
		<html>
			<head>
				<meta charset="UTF-8"/>
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>analyticsignal-preview</title>
				<style type="text/css">
					html, body {
						width: 100%; height: 100%; margin: 0; padding: 0; overflow: hidden;
					}
				</style>
			</head>
			<body>
				<iframe src="${webview.asWebviewUri(uri)}" width="100%" height="100%" frameborder="0"></iframe>
				<script src="setState(${uri})"></script>
			</body>		
		</html>`;
    }
    else {
        fs.readFile(uri.fsPath, (err, data) => {
            webview.html = data.toString("utf-8");
        });
    }
}
class PreviewSerializer {
    deserializeWebviewPanel(webviewPanel, state) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Deserialized state: ${state}`);
            getWebviewContent(webviewPanel.webview, state, true);
        });
    }
}
//# sourceMappingURL=extension-backup.js.map