"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const Application_1 = require("../Application");
const aurelia_dependency_injection_1 = require("aurelia-dependency-injection");
const child_process_1 = require("child_process");
const path_1 = require("path");
const os_1 = require("os");
const fs_1 = require("fs");
const portfinder_1 = require("portfinder");
let BackendService = class BackendService {
    constructor() {
        this.port = 0;
    }
    start(extensionPath) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let debug = Application_1.Application.debugMode === true;
                if (!debug) {
                    this.port = yield this.getPort();
                    let osFolder = '';
                    let osPlatform = os_1.platform();
                    switch (osPlatform) {
                        default:
                            osFolder = 'linux';
                            break;
                        case "win32":
                            osFolder = 'windows';
                            break;
                        case 'darwin':
                            osFolder = 'macos';
                            break;
                    }
                    let exePath = path_1.join(extensionPath, 'bin', osFolder, 'ALStudio.Server');
                    // set executable chmod on linux/osx platforms
                    if (osPlatform != 'win32') {
                        try {
                            fs_1.chmodSync(exePath, 0o755);
                        }
                        catch (e) {
                            Application_1.Application.log.error(`Setting Chmod 755 for ALStudio.Server executable failed. Platform ${osPlatform}\n`, e);
                        }
                    }
                    if (!this.process) {
                        this.process = child_process_1.execFile(exePath, ['--urls', `http://127.0.0.1:${this.port}`], { windowsHide: false }, (error, stdout, stderr) => {
                            if (error) {
                                throw error;
                            }
                            Application_1.Application.log.debug(stdout);
                        });
                        this.process.stdout.on('data', (data) => {
                            let line = data.toString();
                            //if (line.toLowerCase().indexOf('AL Studio Backend is up and running.') != -1)
                            if (line.indexOf('Now listening on') != -1)
                                resolve(true);
                        });
                    }
                    else {
                        resolve(true);
                    }
                }
                else {
                    this.port = 5000;
                    resolve(true);
                }
            }));
        });
    }
    getPort() {
        return __awaiter(this, void 0, void 0, function* () {
            let newPort = yield portfinder_1.getPortPromise({ port: 30000, stopPort: 30150 });
            return newPort;
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (this.process) {
                    this.process.kill();
                    this.process.on('close', (code, signal) => {
                        resolve(true);
                    });
                }
                else {
                    resolve(true);
                }
            });
        });
    }
    checkState(extensionPath, forceRestart) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.process) {
                yield this.stop();
            }
            yield this.start(extensionPath);
        });
    }
};
BackendService = __decorate([
    aurelia_dependency_injection_1.singleton(true),
    __metadata("design:paramtypes", [])
], BackendService);
exports.BackendService = BackendService;
//# sourceMappingURL=BackendService.js.map