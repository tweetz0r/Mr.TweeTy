'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
// import manager
const projectTemplatesPlugin_1 = require("./projectTemplatesPlugin");
// import commands
const OpenTemplatesFolderCommand = require("./commands/openTemplatesFolderCommand");
const SaveProjectAsTemplateCommand = require("./commands/saveProjectAsTemplateCommand");
const DeleteTemplateCommand = require("./commands/deleteTemplateCommand");
const CreateProjectFromTemplateCommand = require("./commands/createProjectFromTemplateCommand");
/**
 * Main entry point for extension
 * @export
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    // create manager and initialize template folder
    let projectTemplatesPlugin = new projectTemplatesPlugin_1.default(context, vscode.workspace.getConfiguration('projectTemplates'));
    projectTemplatesPlugin.createTemplatesDirIfNotExists();
    // register commands
    // open templates folder
    let openTemplatesFolder = vscode.commands.registerCommand('extension.openTemplatesFolder', OpenTemplatesFolderCommand.run.bind(undefined, projectTemplatesPlugin));
    context.subscriptions.push(openTemplatesFolder);
    // save as template
    let saveProjectAsTemplate = vscode.commands.registerCommand('extension.saveProjectAsTemplate', SaveProjectAsTemplateCommand.run.bind(undefined, projectTemplatesPlugin));
    context.subscriptions.push(saveProjectAsTemplate);
    // delete template
    let deleteTemplate = vscode.commands.registerCommand('extension.deleteTemplate', DeleteTemplateCommand.run.bind(undefined, projectTemplatesPlugin));
    context.subscriptions.push(deleteTemplate);
    // create project from template
    let createProjectFromTemplate = vscode.commands.registerCommand('extension.createProjectFromTemplate', CreateProjectFromTemplateCommand.run.bind(undefined, projectTemplatesPlugin));
    context.subscriptions.push(createProjectFromTemplate);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map