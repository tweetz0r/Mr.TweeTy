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
const vscode = require("vscode");
const cp = require('child_process');
// https://github.com/astrand/xclip
// https://www.macobserver.com/tips/quick-tip/use-clipboard-in-terminal-without-mouse/
// https://developer.gnome.org/gtk3/stable/gtk3-Clipboards.html
// https://developer.gnome.org/gtk3/stable/gtk-compiling.html
// sudo apt-get install libgtk-3-dev
function getClipboardData(callback) {
    const ext = vscode.extensions.getExtension('d3v.pastespecial');
    if (!ext) {
        return "";
    }
    //console.log("extension path is '" + ext.extensionPath + "'");
    //console.log("platform is " + process.platform + "(" + process.arch + ")");
    // 'aix', 'darwin', 'freebsd', 'linux', 'openbsd', 'sunos', and 'win32'
    // 'arm', 'arm64', 'ia32', 'mips','mipsel', 'ppc', 'ppc64', 's390', 's390x', 'x32', and 'x64'
    let cmd = "";
    if (process.platform === "win32") {
        cmd = ext.extensionPath + "\\bin\\win32\\winclip.exe";
    }
    else if (process.platform === "linux") {
        cmd = ext.extensionPath + "/bin/linux/gtkclip";
    }
    else {
        vscode.env.clipboard.readText().then((text) => {
            callback(text);
        });
        return;
    }
    cp.exec(cmd, (err, stdout, stderr) => __awaiter(this, void 0, void 0, function* () {
        //console.log('stdout: ' + stdout);
        //console.log('stderr: ' + stderr);
        if (err) {
            console.log("error '" + err + "' when executing command '" + cmd + "'");
        }
        else {
            const obj = JSON.parse(stdout);
            if (Array.isArray(obj)) {
                let pickName = new Array();
                let pickFormat = new Array();
                for (let index = 0; index < obj.length; index++) {
                    pickName.push(obj[index].name);
                    pickFormat.push(obj[index].format);
                }
                const value = yield vscode.window.showQuickPick(pickName, { placeHolder: 'Select Format' });
                if (value !== undefined) {
                    const index = pickName.indexOf(value);
                    const format = pickFormat[index];
                    cp.exec(cmd + " " + format, (err, stdout, stderr) => __awaiter(this, void 0, void 0, function* () {
                        if (err) {
                            console.error(err);
                        }
                        else {
                            const obj = JSON.parse(stdout);
                            callback(obj.data);
                        }
                    }));
                }
            }
        }
    }));
}
function pasteSpecial() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const document = editor.document;
        getClipboardData((text) => {
            editor.edit(editBuilder => {
                if (editor.selection.isEmpty) {
                    editBuilder.insert(editor.selection.active, text);
                }
                else {
                    editor.selections.forEach(sel => {
                        const range = sel.isEmpty ? document.getWordRangeAtPosition(sel.start) || sel : sel;
                        editBuilder.replace(range, text);
                    });
                }
            });
        });
    }
}
function install() {
    if (process.platform !== "linux") {
        return;
    }
    const ext = vscode.extensions.getExtension('d3v.pastespecial');
    if (ext) {
        const cmd = "chmod 0766 " + ext.extensionPath + "/bin/linux/gtkclip";
        cp.exec(cmd, (err, stdout, stderr) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                console.log("error '" + err + "' when executing command '" + cmd + "'");
            }
        }));
    }
}
function activate(context) {
    install();
    let disposable = vscode.commands.registerCommand('extension.pastespecial', () => {
        pasteSpecial();
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map