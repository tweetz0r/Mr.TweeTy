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
const cp = require("child_process");
const sd = require("string_decoder");
const utils_1 = require("./utils");
const vscode = require("vscode");
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle();
class Line {
    constructor(encoding = 'utf8') {
        this.CarriageReturn = 13;
        this.LineFeed = 10;
        this._stringDecoder = new sd.StringDecoder(encoding);
        this._remaining = "";
    }
    write(buffer) {
        let result = [];
        let start = 0;
        let ch;
        let idx = start;
        let value = this._remaining ? this._remaining + this._stringDecoder.write(buffer) : this._stringDecoder.write(buffer);
        if (value.length < 1) {
            return result;
        }
        while (idx < value.length) {
            ch = value.charCodeAt(idx);
            if (ch === this.CarriageReturn || ch === this.LineFeed) {
                result.push(value.substring(start, idx));
                idx++;
                if (idx < value.length) {
                    let lastChar = ch;
                    ch = value.charCodeAt(idx);
                    if ((lastChar === this.CarriageReturn && ch === this.LineFeed) || (lastChar === this.LineFeed && ch === this.CarriageReturn)) {
                        idx++;
                    }
                }
                start = idx;
            }
            else {
                idx++;
            }
        }
        this._remaining = start < value.length ? value.substr(start) : "";
        return result;
    }
    end() {
        return this._remaining;
    }
}
var TaskState;
(function (TaskState) {
    TaskState[TaskState["TaskRun"] = 0] = "TaskRun";
    TaskState[TaskState["TaskStop"] = 1] = "TaskStop";
    TaskState[TaskState["TaskTerminated"] = 2] = "TaskTerminated";
})(TaskState = exports.TaskState || (exports.TaskState = {}));
class TaskRunner {
    constructor() {
        this._cache = {};
        this._onDidTaskStateChanged = new vscode.EventEmitter();
        this.onDidTaskStateChanged = this._onDidTaskStateChanged.event;
    }
    fireOnDidTaskStateChanged(task, state) {
        this._onDidTaskStateChanged.fire({ task: task, state: state });
    }
    outputLog(message) {
        if (message !== "") {
            utils_1.output(message);
        }
    }
    outputInfo(message) {
        utils_1.output(message);
    }
    outputError(message) {
        utils_1.output(message, "ERROR");
    }
    getWindowsShell() {
        return process.env['comspec'] || 'cmd.exe';
    }
    executeProcess(task) {
        return __awaiter(this, void 0, void 0, function* () {
            if (task.task && task.task.execution) {
                try {
                    let execution = task.task.execution;
                    let options = execution.options;
                    if (options) {
                        let childProcess;
                        const defaults = {
                            cwd: options.cwd,
                            env: process.env
                        };
                        if (options.executable) {
                            if (this.isWindows) {
                                let winOptions = defaults;
                                winOptions.windowsVerbatimArguments = true;
                                winOptions.detached = false;
                                let args = [
                                    '/s',
                                    '/c',
                                    options.executable
                                ];
                                if (options.shellArgs) {
                                    args = args.concat(options.shellArgs);
                                    childProcess = cp.spawn(this.getWindowsShell(), args, winOptions);
                                    this.handleSpawn(task, childProcess);
                                }
                                else {
                                    this.outputLog(localize("task-panel.taskruner.taskArgumentsAreNotDefined", "Task Arguments are not defined!"));
                                }
                            }
                            else {
                                childProcess = cp.spawn(options.executable, options.shellArgs, defaults);
                                this.handleSpawn(task, childProcess);
                            }
                        }
                        else {
                            this.outputLog(localize("task-panel.taskruner.executableIsNotDefined", "Executable is not defined!"));
                        }
                    }
                }
                catch (error) {
                    this.outputLog(localize("task-panel.taskruner.executeProcessError", "Task or Task execution is not defined!"));
                }
            }
        });
    }
    execute(task) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._cache[task.id]) {
                this.outputInfo(localize("task-panel.taskruner.taskExecute", utils_1.format("Executing '{0}' ...", task.label)));
                this.executeProcess(task);
            }
            else {
                vscode.window.showInformationMessage(localize("task-panel.taskruner.taskExistsInRunningQueue", utils_1.format("Task '{0}' is already in execution queue.", task.label)));
            }
        });
    }
    addTaskToCache(task, childProcess) {
        this._cache[task.id] = { task: task, childProcess: childProcess, terminated: false };
        this.fireOnDidTaskStateChanged(task, TaskState.TaskRun);
        return this._cache[task.id];
    }
    clearTask(task, terminated = false) {
        let state = terminated ? TaskState.TaskTerminated : TaskState.TaskStop;
        this._cache[task.id] = undefined;
        delete this._cache[task.id];
        this.fireOnDidTaskStateChanged(task, state);
    }
    handleSpawn(task, childProcess) {
        let stdoutLine = new Line();
        let stderrLine = new Line();
        let taskCache = this.addTaskToCache(task, childProcess);
        childProcess.on('close', () => {
            [stdoutLine.end(), stderrLine.end()].forEach((line, index) => {
                if (line) {
                    this.outputLog(line);
                }
            });
            this.clearTask(task, taskCache ? taskCache.terminated : true);
            this.outputInfo(localize("task-panel.taskruner.executeFinish", utils_1.format("Executing of '{0}' is finish.", task.label)));
            if (taskCache && taskCache.onTerminateCallback) {
                taskCache.onTerminateCallback();
                taskCache.onTerminateCallback = undefined;
            }
        });
        childProcess.stdout.on('data', (data) => {
            let lines = stdoutLine.write(data);
            lines.forEach(line => this.outputLog(line));
        });
        childProcess.stderr.on('data', (data) => {
            let lines = stderrLine.write(data);
            lines.forEach(line => this.outputLog(line));
        });
    }
    killChildProcess(process) {
        if (process.childProcess) {
            process.childProcess.kill('SIGKILL');
        }
    }
    terminate(taskId, process, cwd) {
        if (this.isWindows) {
            try {
                let options = {
                    stdio: ['pipe', 'pipe', 'ignore']
                };
                if (cwd) {
                    options.cwd = cwd;
                }
                cp.execFileSync('taskkill', ['/T', '/F', '/PID', process.childProcess.pid.toString()], options);
            }
            catch (err) {
                this.outputError(localize("task-panel.taskruner.cannotTerminateTask", "Cannot terminate task!"));
                return false;
            }
        }
        else if (this.isLinux || this.isMacintosh) {
            try {
                let cmd = path.join(__filename, '..', '..', '..', '..', 'resources', 'terminateProcess.sh');
                let result = cp.spawnSync(cmd, [process.childProcess.pid.toString()]);
                if (result.error) {
                    this.outputError(result.error.toString());
                    try {
                        this.killChildProcess(process);
                    }
                    catch (_a) {
                        this.outputError(localize("task-panel.taskruner.cannotTerminateTask", "Cannot terminate task!"));
                        return false;
                    }
                }
            }
            catch (err) {
                this.outputError(localize("task-panel.taskruner.cannotTerminateTask", "Cannot terminate task!"));
                return false;
            }
        }
        else {
            try {
                this.killChildProcess(process);
            }
            catch (error) {
                this.outputError(localize("task-panel.taskruner.cannotTerminateTask", "Cannot terminate task!"));
                return false;
            }
        }
        this.clearTask(process.task);
        this.outputInfo(localize("task-panel.taskruner.executeTerminated", utils_1.format("Executing of '{0}' is terminated.", process.task.label)));
        return true;
    }
    getCwdFromTask(taskItem) {
        let task = taskItem.task;
        if (task) {
            let exec = task.execution;
            if (exec) {
                let options = exec.options;
                if (options) {
                    return options.cwd;
                }
            }
        }
        return undefined;
    }
    terminateProcess(task, callback) {
        const process = this._cache[task.id];
        if (process) {
            process.onTerminateCallback = callback;
            this.terminate(task.id, process, this.getCwdFromTask(task));
        }
        else {
            vscode.window.showErrorMessage(localize("task-panel.taskruner.taskIsNotRunning", utils_1.format("Task '{0}' are not running.", task.label)));
        }
    }
    restartProcess(task) {
        const process = this._cache[task.id];
        if (process) {
            this.terminateProcess(task, () => {
                this.executeProcess(task);
            });
        }
        else {
            vscode.window.showErrorMessage(localize("task-panel.taskruner.taskIsNotRunning", utils_1.format("Task '{0}' are not running.", task.label)));
        }
    }
    reset() {
        Object.keys(this._cache).forEach(id => {
            let process = this._cache[id];
            if (process) {
                this.terminate(id, process);
            }
        });
    }
    get isWindows() {
        return (process.platform === 'win32');
    }
    get isLinux() {
        return (process.platform === 'linux');
    }
    get isMacintosh() {
        return (process.platform === 'darwin');
    }
}
exports.TaskRunner = TaskRunner;
//# sourceMappingURL=taskRuner.js.map