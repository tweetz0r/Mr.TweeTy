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
const path = require("path");
const taskLoader_1 = require("./core/taskLoader");
const utils_1 = require("./core/utils");
const vscode = require("vscode");
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle();
class GruntTaskLoader extends taskLoader_1.TaskLoader {
    constructor(workspaceFolder, configuration) {
        super("grunt", workspaceFolder, configuration);
    }
    getFilePattern(rootPath) {
        return path.join(rootPath, '[Gg]runtfile.js');
    }
    isTaskFileExists(rootPath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.exists(path.join(rootPath, 'gruntfile.js'))) && !(yield this.exists(path.join(rootPath, 'Gruntfile.js')))) {
                return Promise.resolve(false);
            }
            return Promise.resolve(true);
        });
    }
    getCommand(rootPath, folderPath) {
        return __awaiter(this, void 0, void 0, function* () {
            let command = "grunt";
            let platform = process.platform;
            if (!rootPath) {
                return command;
            }
            if (platform === 'win32') {
                if (yield this.exists(path.join(folderPath, 'node_modules', '.bin', 'grunt.cmd'))) {
                    command = path.join(folderPath, 'node_modules', '.bin', 'grunt.cmd');
                }
                else if (yield this.exists(path.join(rootPath, 'node_modules', '.bin', 'grunt.cmd'))) {
                    command = path.join(rootPath, 'node_modules', '.bin', 'grunt.cmd');
                }
            }
            else if ((platform === 'linux' || platform === 'darwin')) {
                if (yield this.exists(path.join(folderPath, 'node_modules', '.bin', 'grunt'))) {
                    command = path.join(folderPath, 'node_modules', '.bin', 'grunt');
                }
                else if (yield this.exists(path.join(rootPath, 'node_modules', '.bin', 'grunt'))) {
                    command = path.join(rootPath, 'node_modules', '.bin', 'grunt');
                }
            }
            else {
                command = 'grunt';
            }
            return Promise.resolve(command);
        });
    }
    extractAliasTask(taskArray, command, taskObj, cwd) {
        let source = this.key;
        let name = taskObj.name;
        let kind = {
            type: source,
            task: name
        };
        let options = { cwd: cwd, executable: `${command}`, shellArgs: [`${name}`, '--no-color'] };
        let task = name.indexOf(' ') === -1
            ? new vscode.Task(kind, this.getWorkspaceFolder, name, source, new vscode.ShellExecution(`${command} ${name}`, options))
            : new vscode.Task(kind, this.getWorkspaceFolder, name, source, new vscode.ShellExecution(`${command} "${name}"`, options));
        taskArray.push(task);
        this.setTaskGroup(name, task);
    }
    pushTask(taskArray, source, fullName, command, subTaskName, cwd) {
        let kind = {
            type: source,
            task: fullName
        };
        let options = { cwd: cwd, executable: `${command}`, shellArgs: [`${subTaskName}`, '--no-color'] };
        let task = new vscode.Task(kind, this.getWorkspaceFolder, fullName, source, new vscode.ShellExecution(`${command} ${subTaskName}`, options));
        taskArray.push(task);
        this.setTaskGroup(fullName, task);
    }
    extractCoreTask(taskArray, command, taskObj, cwd) {
        let source = this.key;
        let name = taskObj.name;
        if (taskObj.targets.length > 0) {
            taskObj.targets.forEach(subTask => {
                let fullName = name + ":" + subTask;
                let subTaskName = name.indexOf(' ') === -1 ? `${fullName}` : `"${fullName}"`;
                this.pushTask(taskArray, source, fullName, command, subTaskName, cwd);
            });
        }
        else {
            this.pushTask(taskArray, source, name, command, name, cwd);
        }
    }
    resolveByPath(taskFolderInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            let command = yield this.getCommand(this.getRootPath, taskFolderInfo.folderPath);
            let supportGruntFilePath = path.join(__filename, '..', '..', '..', 'resources', 'grunt');
            let commandLoadLine = `${command} --tasks ${supportGruntFilePath} _fetchGruntTasks_`;
            let taskResultWorkspace = taskFolderInfo.displayName;
            try {
                this.outputInfo(localize("task-panel.taskloader.startLoadingTasks", "Start loading tasks ..."), taskFolderInfo);
                let { stdout, stderr } = yield this.exec(commandLoadLine, { cwd: taskFolderInfo.folderPath });
                if (stderr && stderr.length > 0) {
                    this.showErrorInChannel(stderr);
                    this.outputError(localize("task-panel.taskloader.errorLoadingTasks", "Error loading tasks."), taskFolderInfo);
                }
                let result = [];
                if (stdout) {
                    try {
                        let lines = stdout.split(/\r{0,1}\n/);
                        if (lines.length > 2 && lines[1].startsWith("{") && lines[1].endsWith("}")) {
                            let tasksDefObj = JSON.parse(lines[1]);
                            let aliasTasks = [];
                            let coreTasks = [];
                            tasksDefObj.aliasTasks.forEach(item => {
                                this.extractAliasTask(aliasTasks, command, item, taskFolderInfo.folderPath);
                            });
                            tasksDefObj.coreTasks.forEach(item => {
                                this.extractCoreTask(coreTasks, command, item, taskFolderInfo.folderPath);
                            });
                            aliasTasks = this.sortTasksAsc(aliasTasks);
                            coreTasks = this.sortTasksAsc(coreTasks);
                            result = aliasTasks.concat(coreTasks);
                        }
                        else {
                            this.outputError(localize("task-panel.taskloader.errorLoadingTasks", "Error loading tasks."), taskFolderInfo);
                            this.showErrorInChannel(lines);
                        }
                    }
                    catch (error) {
                        this.showErrorInChannel(error);
                    }
                }
                this.outputInfo(localize("task-panel.taskloader.finishLoadingTasks", "Finish loading tasks."), taskFolderInfo);
                this.outputInfo(localize("task-panel.taskloader.loadedTasks", utils_1.format("Loaded {0} tasks.", result.length)), taskFolderInfo);
                return Promise.resolve(new taskLoader_1.TaskLoaderResult(taskResultWorkspace, this.key, result, this.getTaskIcons("grunt"), this.initialTreeCollapsibleState));
            }
            catch (error) {
                this.showErrorInChannel(error);
            }
            return Promise.resolve(undefined);
        });
    }
}
exports.GruntTaskLoader = GruntTaskLoader;
//# sourceMappingURL=gruntTaskLoader.js.map