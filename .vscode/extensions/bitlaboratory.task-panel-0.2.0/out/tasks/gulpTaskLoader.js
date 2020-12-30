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
class GulpTaskLoader extends taskLoader_1.TaskLoader {
    constructor(workspaceFolder, configuration) {
        super("gulp", workspaceFolder, configuration);
    }
    getFilePattern(rootPath) {
        return path.join(rootPath, '[Gg]ulpfile{.babel.js,.js,.ts}');
    }
    isTaskFileExists(rootPath) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((yield this.exists(path.join(rootPath, 'gulpfile.js'))) ||
                (yield this.exists(path.join(rootPath, 'gulpfile.babel.js'))) ||
                (yield this.exists(path.join(rootPath, 'Gulpfile.js'))) ||
                (yield this.exists(path.join(rootPath, 'Gulpfile.babel.js')))) {
                return Promise.resolve(true);
            }
            return Promise.resolve(false);
        });
    }
    getCommand(rootPath, folderPath) {
        return __awaiter(this, void 0, void 0, function* () {
            let command = 'gulp';
            let platform = process.platform;
            if (!rootPath) {
                return command;
            }
            if (platform === 'win32') {
                if (yield this.exists(path.join(folderPath, 'node_modules', '.bin', 'gulp.cmd'))) {
                    command = path.join(folderPath, 'node_modules', '.bin', 'gulp.cmd');
                }
                else if (yield this.exists(path.join(rootPath, 'node_modules', '.bin', 'gulp.cmd'))) {
                    command = path.join(rootPath, 'node_modules', '.bin', 'gulp.cmd');
                }
            }
            else if ((platform === 'linux' || platform === 'darwin')) {
                if (yield this.exists(path.join(folderPath, 'node_modules', '.bin', 'gulp'))) {
                    command = path.join(folderPath, 'node_modules', '.bin', 'gulp');
                }
                else if (yield this.exists(path.join(rootPath, 'node_modules', '.bin', 'gulp'))) {
                    command = path.join(rootPath, 'node_modules', '.bin', 'gulp');
                }
            }
            else {
                command = 'gulp';
            }
            return Promise.resolve(command);
        });
    }
    extractTask(taskArray, command, line, cwd) {
        let source = 'gulp';
        let kind = {
            type: source,
            task: line
        };
        let options = { cwd: cwd, executable: `${command}`, shellArgs: ['--no-color', `${line}`] };
        let task = new vscode.Task(kind, this.getWorkspaceFolder, line, source, new vscode.ShellExecution(`${command} ${line}`, options));
        taskArray.push(task);
        this.setTaskGroup(line, task);
    }
    resolveByPath(taskFolderInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            let command = yield this.getCommand(this.getRootPath, taskFolderInfo.folderPath);
            let loadCommandLine = `${command} --tasks-simple --no-color`;
            let taskResultWorkspace = taskFolderInfo.displayName;
            try {
                this.outputInfo(localize("task-panel.taskloader.startLoadingTasks", "Start loading tasks ..."), taskFolderInfo);
                let { stdout, stderr } = yield this.exec(loadCommandLine, { cwd: taskFolderInfo.folderPath });
                if (stderr && stderr.length > 0) {
                    this.showErrorInChannel(stderr);
                    this.outputError(localize("task-panel.taskloader.errorLoadingTasks", "Error loading tasks."), taskFolderInfo);
                }
                let result = [];
                if (stdout) {
                    let lines = stdout.split(/\r{0,1}\n/);
                    for (let line of lines) {
                        if (line.length === 0) {
                            continue;
                        }
                        this.extractTask(result, command, line, taskFolderInfo.folderPath);
                    }
                    result = this.sortTasksAsc(result);
                }
                this.outputInfo(localize("task-panel.taskloader.finishLoadingTasks", "Finish loading tasks."), taskFolderInfo);
                this.outputInfo(localize("task-panel.taskloader.loadedTasks", utils_1.format("Loaded {0} tasks.", result.length)), taskFolderInfo);
                return Promise.resolve(new taskLoader_1.TaskLoaderResult(taskResultWorkspace, this.key, result, this.getTaskIcons("gulp"), this.initialTreeCollapsibleState));
            }
            catch (error) {
                this.showErrorInChannel(error);
            }
            return Promise.resolve(undefined);
        });
    }
}
exports.GulpTaskLoader = GulpTaskLoader;
//# sourceMappingURL=gulpTaskLoader.js.map