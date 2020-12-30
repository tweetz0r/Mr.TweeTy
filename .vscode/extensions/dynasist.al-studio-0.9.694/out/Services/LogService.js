"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Application_1 = require("../Application");
const aurelia_dependency_injection_1 = require("aurelia-dependency-injection");
let LogService = class LogService {
    log(message, logLevel, optionalParams) {
        let msg = this.template.replace('[level]', `[${LogLevel[logLevel]}]`).replace('[msg]', message);
        switch (logLevel) {
            default:
            case LogLevel.Info:
                if (optionalParams)
                    console.info(msg, optionalParams);
                else
                    console.info(msg);
                break;
            case LogLevel.Debug:
                let debug = Application_1.Application.debugMode === true;
                if (debug !== true) {
                    return;
                }
                if (optionalParams)
                    console.debug(msg, optionalParams);
                else
                    console.debug(msg);
                break;
            case LogLevel.Warning:
                if (optionalParams)
                    console.warn(msg, optionalParams);
                else
                    console.warn(msg);
                break;
            case LogLevel.Error:
                if (optionalParams)
                    console.error(msg, optionalParams);
                else
                    console.error(msg);
                break;
        }
    }
    output(message, logLevel = LogLevel.Debug) {
        let msg = this.template.replace('[level]', `[${LogLevel[logLevel]}]`).replace('[msg]', message);
        Application_1.Application.outputChannel.appendLine(msg);
    }
    debug(message, optionalParams) {
        this.log(message, LogLevel.Debug, optionalParams);
    }
    info(message, optionalParams) {
        this.log(message, LogLevel.Info, optionalParams);
    }
    warn(message, optionalParams) {
        this.log(message, LogLevel.Warning, optionalParams);
    }
    error(message, optionalParams) {
        this.log(message, LogLevel.Error, optionalParams);
    }
    get template() {
        return `[${Application_1.Application.displayName}][${(new Date()).toISOString()}][level]: [msg]`;
    }
};
LogService = __decorate([
    aurelia_dependency_injection_1.singleton(true)
], LogService);
exports.LogService = LogService;
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Debug"] = 0] = "Debug";
    LogLevel[LogLevel["Info"] = 1] = "Info";
    LogLevel[LogLevel["Warning"] = 2] = "Warning";
    LogLevel[LogLevel["Error"] = 3] = "Error";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
//# sourceMappingURL=LogService.js.map