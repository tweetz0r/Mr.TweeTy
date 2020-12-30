"use strict";
// tslint:disable:typedef
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const path = require("path");
const vscode = require("vscode");
let diagnosticCollectionRubocop;
let config;
let rubocopPath;
let rubocopConfigFile;
let cookbookPaths = [];
let fileCount;
function activate(context) {
    diagnosticCollectionRubocop = vscode.languages.createDiagnosticCollection("rubocop");
    context.subscriptions.push(diagnosticCollectionRubocop);
    if (vscode.workspace.getConfiguration("rubocop").path === "") {
        if (process.platform === "win32") {
            rubocopPath = "C:\\opscode\\chef-workstation\\embedded\\bin\\cookstyle.bat";
        }
        else {
            rubocopPath = "/opt/chef-workstation/embedded/bin/cookstyle";
        }
    }
    else {
        rubocopPath = vscode.workspace.getConfiguration("rubocop").path;
        console.log("Using custom Rubocop path: " + rubocopPath);
    }
    if (vscode.workspace.getConfiguration("rubocop").configFile === "") {
        console.log("No explicit config file set for Rubocop.");
    }
    else {
        rubocopConfigFile = vscode.workspace.getConfiguration("rubocop").configFile;
        console.log("Using custom Rubocop config from: " + rubocopConfigFile);
    }
    if (vscode.workspace.getConfiguration("rubocop").enable) {
        updateRubyFileCountAndValidate(true);
        context.subscriptions.push(startLintingOnSaveWatcher());
        context.subscriptions.push(startLintingOnConfigurationChangeWatcher());
    }
    // Even if disabled, allow the user to manually validate the entire workspace.
    const command = "chef.validateEntireWorkspace";
    const commandHandler = () => {
        console.log("Called chef.validateEntireWorkspace command handler");
        validateEntireWorkspace();
    };
    context.subscriptions.push(vscode.commands.registerCommand(command, commandHandler));
}
exports.activate = activate;
function convertSeverity(severity) {
    switch (severity) {
        case "fatal":
        case "error":
            return vscode.DiagnosticSeverity.Error;
        case "warning":
            return vscode.DiagnosticSeverity.Warning;
        case "convention":
        case "refactor":
            return vscode.DiagnosticSeverity.Information;
        default:
            return vscode.DiagnosticSeverity.Warning;
    }
}
function updateRubyFileCountAndValidate(warn = false) {
    // OK for this to be approximate
    let stopAt = vscode.workspace.getConfiguration("rubocop").fileCountThreshold + 1;
    fileCount = 0;
    let uriCounter = (u) => {
        fileCount++;
    };
    let countAndValidate = (uri_array) => {
        uri_array.forEach(uriCounter);
        validate(warn);
    };
    vscode.workspace.findFiles("**/*.rb", null, stopAt, null)
        .then(countAndValidate);
}
function validate(warn = false) {
    console.log("Saw at least " + fileCount + " Ruby files in Workspace");
    if (fileCount < vscode.workspace.getConfiguration("rubocop").fileCountThreshold) {
        validateEntireWorkspace();
    }
    else {
        if (warn) {
            let msg = "There are a large number of Ruby files in your workspace. " +
                "The Chef Infra Extension will only lint open files rather than " +
                "the entire workspace to avoid becoming unresponsive.";
            vscode.window.showWarningMessage(msg, "Ok");
        }
        validateOpenFiles();
    }
}
function validateOpenFiles() {
    let relPaths = [];
    vscode.window.visibleTextEditors.forEach((text_editor) => {
        if (text_editor.document.languageId == "ruby" && text_editor.document.fileName) {
            relPaths.unshift(text_editor.document.fileName);
        }
    });
    validatePaths(relPaths);
}
function validateEntireWorkspace() {
    validatePaths([vscode.workspace.rootPath]);
}
function validatePaths(paths) {
    try {
        let spawn = require("child_process").spawnSync;
        let rubocop;
        if (rubocopConfigFile) {
            rubocop = spawn(rubocopPath, ["--parallel", "--config", rubocopConfigFile, "-f", "j"].concat(paths), { cwd: vscode.workspace.rootPath });
        }
        else {
            rubocop = spawn(rubocopPath, ["--parallel", "-f", "j"].concat(paths), { cwd: vscode.workspace.rootPath });
        }
        let rubocopOutput = JSON.parse(rubocop.stdout);
        if (rubocop.status < 2) {
            let arr = [];
            for (var r = 0; r < rubocopOutput.files.length; r++) {
                var rubocopFile = rubocopOutput.files[r];
                let uri = vscode.Uri.file((path.join(vscode.workspace.rootPath, rubocopFile.path)));
                var offenses = rubocopFile.offenses;
                let diagnostics = [];
                for (var i = 0; i < offenses.length; i++) {
                    let _line = parseInt(offenses[i].location.line, 10) - 1;
                    let _start = parseInt(offenses[i].location.column, 10) - 1;
                    let _end = parseInt(_start + offenses[i].location.length, 10);
                    let diagRange = new vscode.Range(_line, _start, _line, _end);
                    let diagMsg = `${offenses[i].message}`;
                    let diagSeverity = convertSeverity(offenses[i].severity);
                    let diagnostic = new vscode.Diagnostic(diagRange, diagMsg, diagSeverity);
                    diagnostics.push(diagnostic);
                }
                arr.push([uri, diagnostics]);
            }
            diagnosticCollectionRubocop.clear();
            diagnosticCollectionRubocop.set(arr);
        }
        else {
            console.log("Rubocop executed but exited with status: " + rubocop.status + rubocop.stdout);
        }
    }
    catch (err) {
        console.log(err);
    }
    return;
}
function startLintingOnSaveWatcher() {
    return vscode.workspace.onDidSaveTextDocument(document => {
        console.log("onDidSaveTextDocument event received (rubocop).");
        if (document.languageId !== "ruby") {
            return;
        }
        validate();
    });
}
function startLintingOnConfigurationChangeWatcher() {
    return vscode.workspace.onDidChangeConfiguration(params => {
        console.log("Workspace configuration changed, validating workspace.");
        validate();
    });
}
//# sourceMappingURL=extension.js.map