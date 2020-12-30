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
const fs = require("fs");
const path = require("path");
/**
 * Recursively copy folder from src to dest
 * @param src source folder
 * @param dest destination folder
 */
function copyDir(src, dest) {
    return __awaiter(this, void 0, void 0, function* () {
        // read contents of source directory
        const entries = fs.readdirSync(src);
        // synchronously create destination if it doesn't exist to ensure 
        //    its existence before we copy individual items into it
        if (!fs.existsSync(dest)) {
            try {
                fs.mkdirSync(dest);
            }
            catch (err) {
                return Promise.reject(err);
            }
        }
        else if (!fs.lstatSync(dest).isDirectory()) {
            return Promise.reject(new Error("Unable to create directory '" + dest + "': already exists as file."));
        }
        let promises = [];
        for (let entry of entries) {
            // full path of src/dest
            const srcPath = path.join(src, entry);
            const destPath = path.join(dest, entry);
            // if directory, recursively copy, otherwise copy file
            if (fs.lstatSync(srcPath).isDirectory()) {
                promises.push(copyDir(srcPath, destPath));
            }
            else {
                try {
                    fs.copyFileSync(srcPath, destPath);
                }
                catch (err) {
                    promises.push(Promise.reject(err));
                }
            }
        }
        yield Promise.all(promises).then((value) => {
            return value;
        }, (reason) => {
            console.log(reason);
            return Promise.reject(reason);
        });
        return Promise.resolve(true);
    });
}
exports.copyDir = copyDir;
/**
 * Recursively delete a directory and all contained contents
 * @param dir directory to delete
 */
function deleteDir(dir) {
    return __awaiter(this, void 0, void 0, function* () {
        if (fs.existsSync(dir) && fs.lstatSync(dir).isDirectory()) {
            let promises = fs.readdirSync(dir).map(function (entry) {
                let fn = path.join(dir, entry);
                if (fs.lstatSync(fn).isDirectory()) {
                    return deleteDir(fn);
                }
                else {
                    try {
                        fs.unlinkSync(fn);
                    }
                    catch (err) {
                        console.error("Failed to delete '" + fn + "':" + err);
                        return Promise.reject(err);
                    }
                    return Promise.resolve(true);
                }
            });
            // wait for all promises
            yield Promise.all(promises).then((value) => {
                return value;
            }, (reason) => {
                console.log(reason);
                return Promise.reject(reason);
            });
            // remove directory
            try {
                fs.rmdirSync(dir);
            }
            catch (err) {
                console.error("Failed to remove directory '" + dir + "': " + err);
                return Promise.reject(err);
            }
            return Promise.resolve(true);
        }
        return Promise.resolve(false);
    });
}
exports.deleteDir = deleteDir;
/**
 * Recursively make directories
 * @param path destination path
 */
function mkdirsSync(dest, mode = undefined) {
    // check if exists
    if (fs.existsSync(dest)) {
        if (fs.lstatSync(dest).isDirectory()) {
            return true;
        }
        else {
            return false;
        }
    }
    // empty path, we failed
    if (!path) {
        return false;
    }
    // ensure existence of parent
    let parent = path.dirname(dest);
    if (!mkdirsSync(parent, mode)) {
        return false;
    }
    // make current directory
    fs.mkdirSync(dest, mode);
    return true;
}
exports.mkdirsSync = mkdirsSync;
//# sourceMappingURL=fsutils.js.map