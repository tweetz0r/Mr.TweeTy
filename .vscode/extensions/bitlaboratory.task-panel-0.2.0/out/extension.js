'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const nls = require("vscode-nls");
const localize = nls.config(process.env.VSCODE_NLS_CONFIG)();
const vscode = require("vscode");
const taskExtension_1 = require("./tasks/taskExtension");
let taskExtension;
function activate(context) {
    try {
        taskExtension = new taskExtension_1.TaskExtension(context);
        taskExtension.start();
    }
    catch (error) {
        vscode.window.showErrorMessage(localize('task-panel.extension.cannotActivateExtension', 'Cannot activate task-panel Extension!'));
    }
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
    if (taskExtension) {
        taskExtension.dispose();
        taskExtension = undefined;
    }
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map