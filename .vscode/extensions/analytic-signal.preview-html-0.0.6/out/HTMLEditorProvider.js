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
        //
        // get configuration settings:
        //
        let retainContextWhenHidden = vscode.workspace.getConfiguration("preview-html").get("retainContextWhenHidden");
        let options = {
            webviewPanelOptions: {
                retainContextWhenHidden: retainContextWhenHidden
            },
            supportsMultipleEditorsPerDocument: true
        };
        const provider = new HTMLEditorProvider(context);
        const providerRegistration = vscode.window.registerCustomEditorProvider(HTMLEditorProvider.viewType, provider, options);
        return providerRegistration;
    }
    //
    // called on custom editor opened:
    //
    resolveCustomTextEditor(document, webviewPanel, _token) {
        return __awaiter(this, void 0, void 0, function* () {
            //
            // get settings configuration:
            //
            let enableScripts = vscode.workspace.getConfiguration("preview-html").get("enableScripts");
            if (enableScripts) {
                //
                // setup initial content for the webview:
                //
                webviewPanel.webview.options = {
                    enableScripts: enableScripts,
                };
            }
            webviewPanel.webview.html = this.getWebviewContent(webviewPanel.webview, document.uri);
            //	
            // hook up event handlers so that we can synchronize the webview with the text document:
            //
            // 1. wiring to update webview on document change:
            //
            // const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
            // 	if (e.document.uri.toString() === document.uri.toString()) {
            // 		webviewPanel.webview.html = this.getWebviewContentFromDocument(webviewPanel.webview, document);
            // 	}
            // });
            let updateOnSaveDocument = vscode.workspace.getConfiguration("preview-html").get("updateOnSaveDocument");
            if (updateOnSaveDocument) {
                //
                // 1. wiring to update webview on document save:
                //
                const saveDocumentSubscription = vscode.workspace.onDidSaveTextDocument(e => {
                    if (e.uri.toString() === document.uri.toString()) {
                        webviewPanel.webview.html = "";
                        webviewPanel.webview.html = this.getWebviewContent(webviewPanel.webview, document.uri);
                    }
                });
                // 
                // 2. wiring to dispose of the listener when editor is closed:
                //
                webviewPanel.onDidDispose(() => {
                    saveDocumentSubscription.dispose();
                });
            }
        });
    }
    //
    // get html content for editor webview:
    //
    getWebviewContent(webview, uri) {
        function style() {
            let result = "border:none;width:100%;height:100%";
            let fitPreviewInWindow = vscode.workspace.getConfiguration("preview-html").get("fitPreviewInWindow");
            let fitPreviewHeight = vscode.workspace.getConfiguration("preview-html").get("fitPreviewHeight");
            if (fitPreviewInWindow === false) {
                result = "border:none;width:100%;height:" + fitPreviewHeight + "px";
            }
            return result;
        }
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
				<iframe src="${webview.asWebviewUri(uri)}" style="${style()}"></iframe>
			</body>		
		</html>`;
    }
    getWebviewContentFromDocument(webview, doc) {
        function text() {
            let result = doc.getText();
            result = result.replace(/"/g, '&quot;');
            return result;
        }
        function style() {
            let result = "border:none;width:100%;height:100%";
            let fitPreviewInWindow = vscode.workspace.getConfiguration("preview-html").get("fitPreviewInWindow");
            let fitPreviewHeight = vscode.workspace.getConfiguration("preview-html").get("fitPreviewHeight");
            if (fitPreviewInWindow === false) {
                result = "border:none;width:100%;height:" + fitPreviewHeight + "px";
            }
            return result;
        }
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
				<iframe srcdoc="${text()}" style="${style()}"></iframe>
			</body>		
		</html>`;
    }
}
exports.HTMLEditorProvider = HTMLEditorProvider;
HTMLEditorProvider.viewType = 'analyticsignal.preview-html';
//# sourceMappingURL=HTMLEditorProvider.js.map