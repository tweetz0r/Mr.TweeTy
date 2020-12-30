/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *
 *  Modified from
 *      vscode/src/vs/workbench/services/configurationResolver/node/variableResolver.ts
 *      vscode/src/vs/workbench/services/configurationResolver/electron-browser/configurationResolverService.ts
 *  to reduce dependencies, for use with extensions
 *
 *  cantonios 2018
 *--------------------------------------------------------------------------------------------*/
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
const path = require("path");
class VariableResolver {
    constructor(envVariables = process.env) {
        // convert dictionary to lowercase for windows, otherwise use directly
        this._envVariables = {};
        if (process.platform === 'win32') {
            this._envVariables = Object.create(null);
            Object.keys(envVariables).forEach(key => {
                let val = envVariables[key];
                if (val) {
                    this._envVariables[key.toLowerCase()] = val;
                }
            });
        }
        else {
            this._envVariables = Object.create(null);
            Object.keys(envVariables).forEach(key => {
                let val = envVariables[key];
                if (val) {
                    this._envVariables[key] = val;
                }
            });
        }
    }
    /**
     * Finds all variables in object using cmdVar and pushes them into commands.
     * @param cmdVar Regex to use for finding variables.
     * @param object object is searched for variables.
     * @param commands All found variables are returned in commands.
     */
    findVariables(cmdVar, object, commands) {
        if (!object) {
            return;
        }
        else if (typeof object === 'string') {
            let matches;
            while ((matches = cmdVar.exec(object)) !== null) {
                if (matches.length === 2) {
                    const command = matches[1];
                    if (commands.indexOf(command) < 0) {
                        commands.push(command);
                    }
                }
            }
        }
        else if (object instanceof Array) {
            object.forEach(value => {
                this.findVariables(cmdVar, value, commands);
            });
        }
        else {
            Object.keys(object).forEach(key => {
                const value = object[key];
                this.findVariables(cmdVar, value, commands);
            });
        }
    }
    sequence(promiseFactories) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = [];
            let index = 0;
            const len = promiseFactories.length;
            function next() {
                return index < len ? promiseFactories[index++]() : null;
            }
            function thenHandler(result) {
                if (result !== undefined && result !== null) {
                    results.push(result);
                }
                const n = next();
                if (n) {
                    return n.then(thenHandler);
                }
                return Promise.resolve(results);
            }
            return Promise.resolve(null).then(thenHandler);
        });
    }
    resolveFromMap(match, argument, commandValueMapping, prefix) {
        if (argument && commandValueMapping) {
            const v = commandValueMapping[prefix + ':' + argument];
            if (typeof v === 'string') {
                return v;
            }
            throw new Error("noValueForCommand: '" + match + "' can not be resolved because the command has no value.");
        }
        return match;
    }
    resolveCommands(configuration) {
        return __awaiter(this, void 0, void 0, function* () {
            // use an array to preserve order of first appearance
            const cmd_var = /\${command:(.*?)}/g;
            const commands = [];
            this.findVariables(cmd_var, configuration, commands);
            let cancelled = false;
            const commandValueMapping = Object.create(null);
            if (commands.length > 0) {
                const factory = commands.map(commandVariable => {
                    return () => __awaiter(this, void 0, void 0, function* () {
                        return vscode.commands.executeCommand(commandVariable, configuration).then(result => {
                            if (typeof result === 'string') {
                                commandValueMapping['command:' + commandVariable] = result;
                            }
                            else if (!result) {
                                cancelled = true;
                            }
                            else {
                                return Promise.reject("stringsOnlySupported: Command '" + commandVariable
                                    + "' did not return a string result. Only strings are supported as results for commands used for variable substitution.");
                            }
                        });
                    });
                });
                return this.sequence(factory).then(() => cancelled ? undefined : commandValueMapping);
            }
            return Promise.resolve(undefined);
        });
    }
    hasDriveLetter(path) {
        return !!(process.platform === 'win32' && path && path[1] === ':');
    }
    normalizeDriveLetter(path) {
        if (this.hasDriveLetter(path)) {
            return path.charAt(0).toUpperCase() + path.slice(1);
        }
        return path;
    }
    resolve(value) {
        return __awaiter(this, void 0, void 0, function* () {
            // command maps
            let commandValueMapping = yield this.resolveCommands(value);
            const replaced = value.replace(VariableResolver.VARIABLE_REGEXP, (match, variable) => {
                let argument = "";
                let folderUri = undefined;
                let filePath = "";
                const parts = variable.split(':');
                if (parts && parts.length > 1) {
                    variable = parts[0];
                    argument = parts[1];
                }
                else {
                    argument = "";
                }
                switch (variable) {
                    case 'env':
                        if (argument) {
                            if (process.platform === "win32") {
                                argument = argument.toLowerCase();
                            }
                            const val = this._envVariables[argument];
                            if (val) {
                                return val;
                            }
                            // For `env` we should do the same as a normal shell does - evaluates missing envs to an empty string #46436
                            return "";
                        }
                        throw new Error("missingEnvVarName: '" + match + "' cannot be resolved because no environment variable name is given.");
                    case 'config':
                        if (argument) {
                            const config = vscode.workspace.getConfiguration();
                            const val = config.get(argument, "");
                            if (!val) {
                                throw new Error("configNotFound: '" + match + "' cannot be resolved because setting '" + argument + "' not found.");
                            }
                            if (typeof val === 'object') {
                                throw new Error("configNoString: '" + match + "' cannot be resolved because '" + argument + "' is a structured value.");
                            }
                            return val;
                        }
                        throw new Error("missingConfigName '" + match + "' cannot be resolved because no settings name is given.");
                    case 'command': {
                        if (commandValueMapping) {
                            return this.resolveFromMap(match, argument, commandValueMapping, 'command');
                        }
                        else {
                            throw new Error("commandNoMapping: '" + match + "' cannot be resolved because command values were not computed");
                        }
                    }
                    case 'input': {
                        throw new Error("canNotResolveInput: '" + match + "' not implemented.");
                    }
                    default: {
                        // common error handling for all variables that require an open folder and accept a folder name argument
                        switch (variable) {
                            case 'workspaceRoot':
                            case 'workspaceFolder':
                            case 'workspaceRootFolderName':
                            case 'workspaceFolderBasename':
                            case 'relativeFile':
                                if (argument) {
                                    if (vscode.workspace.workspaceFolders) {
                                        const folder = vscode.workspace.workspaceFolders.filter(f => f.name === argument).pop();
                                        if (folder) {
                                            folderUri = folder.uri;
                                        }
                                    }
                                    else {
                                        throw new Error("canNotFindFolder: '" + match + "' can not be resolved. No such folder '" + argument + "'.");
                                    }
                                }
                                if (!folderUri) {
                                    // only work if single workspace
                                    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length === 1) {
                                        folderUri = vscode.workspace.workspaceFolders[0].uri;
                                    }
                                    else {
                                        throw new Error("canNotResolveWorkspace: '" + match + "' cannot resolve workspace.  Please open a single folder, or specify a root path name");
                                    }
                                }
                                break;
                            default:
                                break;
                        }
                        // common error handling for all variables that require an open file
                        switch (variable) {
                            case 'file':
                            case 'relativeFile':
                            case 'fileDirname':
                            case 'fileExtname':
                            case 'fileBasename':
                            case 'fileBasenameNoExtension':
                                let activeEditor = vscode.window.activeTextEditor;
                                if (activeEditor) {
                                    filePath = activeEditor.document.fileName;
                                }
                                break;
                            default:
                                break;
                        }
                        switch (variable) {
                            case 'workspaceRoot':
                            case 'workspaceFolder':
                                return folderUri ? this.normalizeDriveLetter(folderUri.fsPath) : "";
                            case 'cwd':
                                return (folderUri ? this.normalizeDriveLetter(folderUri.fsPath) : process.cwd());
                            case 'workspaceRootFolderName':
                            case 'workspaceFolderBasename':
                                return folderUri ? path.basename(folderUri.fsPath) : "";
                            case 'lineNumber': {
                                const activeEditor = vscode.window.activeTextEditor;
                                if (activeEditor) {
                                    return activeEditor.selection.active.line.toString();
                                }
                                throw new Error("canNotResolveLineNumber: '" + match + "' cannot be resolved. Make sure to have a line selected in the active editor.");
                            }
                            case 'selectedText': {
                                const activeEditor = vscode.window.activeTextEditor;
                                if (activeEditor) {
                                    const selectedText = activeEditor.document.getText(activeEditor.selection);
                                    if (selectedText) {
                                        return selectedText;
                                    }
                                }
                                throw new Error("canNotResolveSelectedText: '" + match + "' can not be resolved. Make sure to have some text selected in the active editor.");
                            }
                            case 'file':
                                return filePath;
                            case 'relativeFile':
                                if (folderUri) {
                                    return path.normalize(path.relative(folderUri.fsPath, filePath));
                                }
                                return filePath;
                            case 'fileDirname':
                                return path.dirname(filePath);
                            case 'fileExtname':
                                return path.extname(filePath);
                            case 'fileBasename':
                                return path.basename(filePath);
                            case 'fileBasenameNoExtension':
                                const basename = path.basename(filePath);
                                return (basename.slice(0, basename.length - path.extname(basename).length));
                            case 'execPath': {
                                throw new Error("canNotResolveExecPath: '" + match + "' not implemented.");
                            }
                            default:
                                return match;
                        }
                    }
                }
            });
            return replaced;
        });
    }
}
VariableResolver.VARIABLE_REGEXP = /\$\{(.*?)\}/g;
exports.default = VariableResolver;
//# sourceMappingURL=variableResolver.js.map