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
const fs = require("fs");
const path = require("path");
const fsutils = require("./utilities/fsutils");
const fmutils = require("./utilities/fmutils");
/**
 * Main class to handle the logic of the Project Templates
 * @export
 * @class TemplateManager
 */
class ProjectTemplatesPlugin {
    constructor(econtext, config) {
        this.config = config;
        this.econtext = econtext;
    }
    /**
     * Updates the current configuration settings
     * @param config workspace configuration
     */
    updateConfiguration(config) {
        this.config = config;
    }
    /**
     * Selects a workspace folder.  If args contains an fsPath, then it uses
     * that.  Otherwise, for single root workspaces it will select the root directory,
     * or for multi-root will present a chooser to select a workspace.
     * @param args
     */
    selectWorkspace(args) {
        return __awaiter(this, void 0, void 0, function* () {
            let workspace = "";
            // check arguments
            if (args && args.fsPath) {
                workspace = args.fsPath;
            }
            else if (vscode.workspace.workspaceFolders) {
                // single or multi-root
                if (vscode.workspace.workspaceFolders.length === 1) {
                    workspace = vscode.workspace.workspaceFolders[0].uri.fsPath;
                }
                else if (vscode.workspace.workspaceFolders.length > 1) {
                    // choose workspace
                    let ws = yield vscode.window.showWorkspaceFolderPick();
                    if (ws) {
                        workspace = ws.uri.fsPath;
                    }
                }
            }
            return workspace;
        });
    }
    /**
     * Returns a list of available project templates by reading the Templates Directory.
     * @returns list of templates found
     */
    getTemplates() {
        this.createTemplatesDirIfNotExists();
        let templateDir = this.getTemplatesDir();
        let templates = fs.readdirSync(templateDir).map(function (item) {
            // ignore hidden folders
            if (!/^\./.exec(item)) {
                return fs.statSync(path.join(templateDir, item)).isDirectory ? item : null;
            }
            return null;
        }).filter(function (filename) {
            return filename !== null;
        });
        return templates;
    }
    /**
     * Returns the templates directory location.
     * If no user configuration is found, the extension will look for
     * templates in USER_DATA_DIR/Code/ProjectTemplates.
     * Otherwise it will look for the path defined in the extension configuration.
     * @return the templates directory
     */
    getTemplatesDir() {
        let dir = this.config.get('templatesDirectory', this.getDefaultTemplatesDir());
        if (!dir) {
            dir = this.getDefaultTemplatesDir();
        }
        return dir;
    }
    /**
     * Returns the default templates location, which is based within the extensions directory.
     * @returns default template directory
     */
    getDefaultTemplatesDir() {
        let userDataDir;
        let dir = context.
        ;
        return path.join(userDataDir, 'Code', 'User', 'ProjectTemplates');
    }
    /**
     * Creates the templates directory if it does not exists
     * @throws Error
     */
    createTemplatesDirIfNotExists() {
        let templatesDir = this.getTemplatesDir();
        if (!fs.existsSync(templatesDir)) {
            try {
                fs.mkdirSync(templatesDir, 0o775);
            }
            catch (err) {
                if (err.code !== 'EEXIST') {
                    throw err;
                }
            }
        }
    }
    /**
     * Chooses a template from the set of templates available in the root
     * template directory.  If none exists, presents option to open root
     * template folder.
     *
     * @returns chosen template name, or undefined if none selected
     */
    chooseTemplate() {
        return __awaiter(this, void 0, void 0, function* () {
            // read templates
            let templates = this.getTemplates();
            let templateRoot = this.getTemplatesDir();
            if (templates.length === 0) {
                let optionGoToTemplates = {
                    title: "Open Templates Folder"
                };
                vscode.window.showInformationMessage("No templates found!", optionGoToTemplates).then(option => {
                    // nothing selected
                    if (!option) {
                        return;
                    }
                    fmutils.openFolderInExplorer(templateRoot);
                });
                return undefined;
            }
            // show the list of available templates.
            return vscode.window.showQuickPick(templates);
        });
    }
    /**
     * Deletes a template from the template root directory
     * @param template name of template
     * @returns success or failure
     */
    deleteTemplate(template) {
        return __awaiter(this, void 0, void 0, function* () {
            // no template, cancel
            if (!template) {
                return false;
            }
            let templateRoot = this.getTemplatesDir();
            let templateDir = path.join(templateRoot, template);
            if (fs.existsSync(templateDir) && fs.lstatSync(templateDir).isDirectory()) {
                // confirm delete
                let success = yield vscode.window.showQuickPick(["Yes", "No"], {
                    placeHolder: "Are you sure you wish to delete the project template '" + template + "'?"
                }).then((choice) => __awaiter(this, void 0, void 0, function* () {
                    if (choice === "Yes") {
                        // delete template
                        // console.log("Deleting template folder '" + templateDir + "'");
                        let ds = yield fsutils.deleteDir(templateDir).then((value) => {
                            return value;
                        }, (reason) => {
                            return Promise.reject(reason);
                        });
                        return ds;
                    }
                    return false;
                }), (reason) => {
                    console.log(reason);
                    return Promise.reject(reason);
                });
                return success;
            }
            return false;
        });
    }
    /**
     * Saves a workspace as a new template
     * @param  workspace absolute path of workspace
     * @returns  name of template
     */
    saveAsTemplate(workspace) {
        return __awaiter(this, void 0, void 0, function* () {
            // ensure templates directory exists
            this.createTemplatesDirIfNotExists();
            let projectName = path.basename(workspace);
            // ask for project name
            let inputOptions = {
                prompt: "Please enter the desired template name",
                value: projectName
            };
            // prompt user
            return yield vscode.window.showInputBox(inputOptions).then((filename) => __awaiter(this, void 0, void 0, function* () {
                // empty filename exits
                if (!filename) {
                    return undefined;
                }
                // determine template dir
                let template = path.basename(filename);
                let templateDir = path.join(this.getTemplatesDir(), template);
                console.log("Destination folder: " + templateDir);
                // check if exists
                if (fs.existsSync(templateDir)) {
                    // confirm over-write
                    yield vscode.window.showQuickPick(["Yes", "No"], {
                        placeHolder: "Template '" + filename + "' already exists.  Do you wish to overwrite?"
                    }).then((choice) => __awaiter(this, void 0, void 0, function* () {
                        if (choice === "Yes") {
                            // delete original and copy new template folder
                            yield fsutils.deleteDir(templateDir);
                            yield fsutils.copyDir(workspace, templateDir);
                        }
                    }), (reason) => {
                        return Promise.reject(reason);
                    });
                }
                else {
                    // copy current workspace to new template folder
                    yield fsutils.copyDir(workspace, templateDir);
                }
                return template;
            }));
        });
    }
    /**
     * Replaces any placeholders found within the input data.  Will use a
     * dictionary of values from the user's workspace settings, or will prompt
     * if value is not known.
     *
     * @param data input data
     * @param placeholderRegExp  regular expression to use for detecting
     *                           placeholders.  The first capture group is used
     *                           as the key.
     * @param placeholders dictionary of placeholder key-value pairs
     * @returns the (potentially) modified data, with the same type as the input data
     */
    resolvePlaceholders(data, placeholderRegExp, placeholders) {
        return __awaiter(this, void 0, void 0, function* () {
            // resolve each placeholder
            let regex = RegExp(placeholderRegExp, 'g');
            // collect set of expressions and their replacements
            let match;
            let nmatches = 0;
            let str;
            let encoding = "utf8";
            if (Buffer.isBuffer(data)) {
                // get default encoding
                let fconfig = vscode.workspace.getConfiguration('files');
                encoding = fconfig.get("files.encoding", "utf8");
                try {
                    str = data.toString(encoding);
                }
                catch (Err) {
                    // cannot decipher text from encoding, assume raw data
                    return data;
                }
            }
            else {
                str = data;
            }
            while (match = regex.exec(str)) {
                let key = match[1];
                let val = placeholders[key];
                if (!val) {
                    let variableInput = {
                        prompt: `Please enter the desired value for "${match[0]}"`
                    };
                    val = yield vscode.window.showInputBox(variableInput).then(value => {
                        if (value) {
                            // update map
                            placeholders[key] = value;
                        }
                        return value;
                    });
                }
                ++nmatches;
            }
            // reset regex
            regex.lastIndex = 0;
            // compute output
            let out = data;
            if (nmatches > 0) {
                // replace placeholders in string
                str = str.replace(regex, (match, key) => {
                    let val = placeholders[key];
                    if (!val) {
                        val = match;
                    }
                    return val;
                });
                // if input was a buffer, re-encode to buffer
                if (Buffer.isBuffer(data)) {
                    out = Buffer.from(str, encoding);
                }
                else {
                    out = str;
                }
            }
            return out;
        });
    }
    /**
     * Populates a workspace folder with the contents of a template
     * @param workspace current workspace folder to populate
     */
    createFromTemplate(workspace) {
        return __awaiter(this, void 0, void 0, function* () {
            this.createTemplatesDirIfNotExists();
            // choose a template
            let template = yield this.chooseTemplate();
            if (!template) {
                return;
            }
            // get template folder
            let templateRoot = this.getTemplatesDir();
            let templateDir = path.join(templateRoot, template);
            if (!fs.existsSync(templateDir) || !fs.lstatSync(templateDir).isDirectory()) {
                vscode.window.showErrorMessage("Template '" + template + "' does not exist.");
                return undefined;
            }
            // update placeholder configuration
            let usePlaceholders = this.config.get("usePlaceholders", false);
            let placeholderRegExp = this.config.get("placeholderRegExp", "#{(\\w+?)}");
            let placeholders = this.config.get("placeholders", {});
            // re-read configuration, merge with current list of placeholders
            let newplaceholders = this.config.get("placeholders", {});
            for (let key in newplaceholders) {
                placeholders[key] = newplaceholders[key];
            }
            // recursively copy files, replacing placeholders as necessary
            let copyFunc = (src, dest) => __awaiter(this, void 0, void 0, function* () {
                // maybe replace placeholders in filename
                if (usePlaceholders) {
                    dest = (yield this.resolvePlaceholders(dest, placeholderRegExp, placeholders));
                }
                if (fs.lstatSync(src).isDirectory()) {
                    // create directory if doesn't exist
                    if (!fs.existsSync(dest)) {
                        fs.mkdirSync(dest);
                    }
                    else if (!fs.lstatSync(dest).isDirectory()) {
                        // fail if file exists
                        throw new Error("Failed to create directory '" + dest + "': file with same name exists.");
                    }
                }
                else {
                    // ask before overwriting existing file
                    while (fs.existsSync(dest)) {
                        // if it is not a file, cannot overwrite
                        if (!fs.lstatSync(dest).isFile()) {
                            let reldest = path.relative(workspace, dest);
                            let variableInput = {
                                prompt: `Cannot overwrite "${reldest}".  Please enter a new filename"`,
                                value: reldest
                            };
                            // get user's input
                            dest = yield vscode.window.showInputBox(variableInput).then(value => {
                                if (!value) {
                                    return dest;
                                }
                                return value;
                            });
                            // if not absolute path, make workspace-relative
                            if (!path.isAbsolute(dest)) {
                                dest = path.join(workspace, dest);
                            }
                        }
                        else {
                            // ask if user wants to replace, otherwise prompt for new filename
                            let reldest = path.relative(workspace, dest);
                            let choice = yield vscode.window.showQuickPick(["Overwrite", "Rename", "Skip", "Abort"], {
                                placeHolder: `Destination file "${reldest}" already exists.  What would you like to do?`
                            });
                            if (choice === "Overwrite") {
                                // delete existing file
                                fs.unlinkSync(dest);
                            }
                            else if (choice === "Rename") {
                                // prompt user for new filename
                                let variableInput = {
                                    prompt: "Please enter a new filename",
                                    value: reldest
                                };
                                // get user's input
                                dest = yield vscode.window.showInputBox(variableInput).then(value => {
                                    if (!value) {
                                        return dest;
                                    }
                                    return value;
                                });
                                // if not absolute path, make workspace-relative
                                if (!path.isAbsolute(dest)) {
                                    dest = path.join(workspace, dest);
                                }
                            }
                            else if (choice === "Skip") {
                                // skip
                                return true;
                            }
                            else {
                                // abort
                                return false;
                            } // overwrite or rename
                        } // if file
                    } // while file exists
                    // get src file contents
                    let fileContents = fs.readFileSync(src);
                    if (usePlaceholders) {
                        fileContents = (yield this.resolvePlaceholders(fileContents, placeholderRegExp, placeholders));
                    }
                    // ensure directories exist
                    let parent = path.dirname(dest);
                    fsutils.mkdirsSync(parent);
                    // write file contents to destination
                    fs.writeFileSync(dest, fileContents);
                }
                return true;
            }); // copy function
            // actually copy the file recursively
            yield this.recursiveApplyInDir(templateDir, workspace, copyFunc);
            return template;
        });
    }
    /**
    * Recursively apply a function on a pair of files or directories from source to dest.
    *
    * @param src source file or folder
    * @param dest destination file or folder
    * @param func function to apply between src and dest
    * @return if recursion should continue
    * @throws Error if function fails
    */
    recursiveApplyInDir(src, dest, func) {
        return __awaiter(this, void 0, void 0, function* () {
            // apply function between src/dest
            let success = yield func(src, dest);
            if (!success) {
                return false;
            }
            if (fs.lstatSync(src).isDirectory()) {
                // read contents of source directory and iterate
                const entries = fs.readdirSync(src);
                for (let entry of entries) {
                    // full path of src/dest
                    const srcPath = path.join(src, entry);
                    const destPath = path.join(dest, entry);
                    // if directory, recursively copy, otherwise copy file
                    success = yield this.recursiveApplyInDir(srcPath, destPath, func);
                    if (!success) {
                        return false;
                    }
                }
            }
            return true;
        });
    }
} // templateManager
exports.default = ProjectTemplatesPlugin;
//# sourceMappingURL=templateManager.js.map