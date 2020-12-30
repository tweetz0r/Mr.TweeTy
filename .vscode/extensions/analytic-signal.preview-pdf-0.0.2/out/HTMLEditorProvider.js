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
exports.HTMLEditorProvider = void 0;
const vscode = require("vscode");
class HTMLEditorProvider {
    constructor(context) {
        this.context = context;
    }
    static register(context) {
        const provider = new HTMLEditorProvider(context);
        const providerRegistration = vscode.window.registerCustomEditorProvider(HTMLEditorProvider.viewType, provider);
        return providerRegistration;
    }
    //
    // called on custom editor opened:
    //
    resolveCustomTextEditor(document, webviewPanel, _token) {
        return __awaiter(this, void 0, void 0, function* () {
            //
            // setup initial content for the webview:
            //
            webviewPanel.webview.options = {
                enableScripts: true,
            };
            webviewPanel.webview.html = this.getWebviewContent(webviewPanel.webview, document.uri, true);
            //
            // function to synchronize webview with document:
            //
            function updateWebview() {
                webviewPanel.webview.postMessage({
                    type: 'update',
                    text: document.uri,
                });
            }
            //	
            // hook up event handlers so that we can synchronize the webview with the text document:
            //
            // 1. wiring to uodate webview on document change:
            //
            const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
                if (e.document.uri.toString() === document.uri.toString()) {
                    updateWebview();
                }
            });
            // 
            // 2. wiring to dispose of the listener when editor is closed:
            //
            webviewPanel.onDidDispose(() => {
                changeDocumentSubscription.dispose();
            });
            // 
            // 3. wiring to receive messages from webview:
            //
            webviewPanel.webview.onDidReceiveMessage(e => {
                switch (e.type) {
                    case 'add':
                        vscode.window.showInformationMessage('onDidReceiveMessage');
                        return;
                }
            });
            //
            // show document in webview:
            //
            updateWebview();
        });
    }
    //
    // get html content for editor webview:
    //
    getWebviewContent(webview, uri, fill) {
        return `<!DOCTYPE html>
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
			</body>		
		</html>`;
    }
}
exports.HTMLEditorProvider = HTMLEditorProvider;
HTMLEditorProvider.viewType = 'analyticsignal.preview-html';
//# sourceMappingURL=HTMLEditorProvider.js.map