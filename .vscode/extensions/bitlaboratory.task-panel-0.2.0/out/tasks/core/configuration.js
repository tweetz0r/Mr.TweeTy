'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
var TreeCollapsibleState;
(function (TreeCollapsibleState) {
    TreeCollapsibleState[TreeCollapsibleState["Collapsed"] = 1] = "Collapsed";
    TreeCollapsibleState[TreeCollapsibleState["Expanded"] = 2] = "Expanded";
})(TreeCollapsibleState = exports.TreeCollapsibleState || (exports.TreeCollapsibleState = {}));
var TaskSearchConditionFlags;
(function (TaskSearchConditionFlags) {
    TaskSearchConditionFlags[TaskSearchConditionFlags["RootFolder"] = 1] = "RootFolder";
    TaskSearchConditionFlags[TaskSearchConditionFlags["SubFolders"] = 2] = "SubFolders";
    TaskSearchConditionFlags[TaskSearchConditionFlags["RootAndSubFolders"] = 3] = "RootAndSubFolders";
})(TaskSearchConditionFlags = exports.TaskSearchConditionFlags || (exports.TaskSearchConditionFlags = {}));
class TasksPanelConfiguration {
    constructor() {
        this._configIsChanged = true;
        this._configuration = this.loadConfiguration();
        this._onDidChangeConfigurationDispose = vscode.workspace.onDidChangeConfiguration((event) => this.onWorkspaceConfigurationChanged(event));
    }
    onWorkspaceConfigurationChanged(event) {
        this._configIsChanged = true;
    }
    getSearchConditionFlagsFromConfig(searchCondition) {
        switch (searchCondition) {
            case "RootFolder":
                return TaskSearchConditionFlags.RootFolder;
            case "SubFolders":
                return TaskSearchConditionFlags.SubFolders;
            case "RootAndSubFolders":
                return TaskSearchConditionFlags.RootAndSubFolders;
            default:
                return TaskSearchConditionFlags.RootFolder;
        }
    }
    loadConfiguration() {
        let configuration = vscode.workspace.getConfiguration('tasks-panel');
        let treeState = configuration.get('treeCollapsibleState');
        let searchGruntTasks = configuration.get('search.gruntTasks');
        let searchGulpTasks = configuration.get('search.gulpTasks');
        let searchCondition = configuration.get('search.searchCondition');
        let inSubFolders = configuration.get('search.inSubFolders');
        return {
            treeCollapsibleState: treeState === undefined ? TreeCollapsibleState.Expanded : treeState === 'collapsed' ? TreeCollapsibleState.Collapsed : TreeCollapsibleState.Expanded,
            searchGruntTasks: searchGruntTasks === undefined ? true : searchGruntTasks,
            searchGulpTasks: searchGulpTasks === undefined ? true : searchGulpTasks,
            searchCondition: this.getSearchConditionFlagsFromConfig(searchCondition),
            searchSubFolders: inSubFolders !== undefined ? inSubFolders : null
        };
    }
    get(key) {
        if (this._configIsChanged) {
            this._configuration = this.loadConfiguration();
            this._configIsChanged = false;
        }
        return this._configuration[key];
    }
    get isConfigChanged() {
        return this._configIsChanged;
    }
    dispose() {
        this._configIsChanged = true;
        this._onDidChangeConfigurationDispose.dispose();
    }
}
exports.TasksPanelConfiguration = TasksPanelConfiguration;
TasksPanelConfiguration.TREE_COLLAPSIBLE_STATE = "treeCollapsibleState";
TasksPanelConfiguration.SEARCH_GRUNT_TASKS = "searchGruntTasks";
TasksPanelConfiguration.SEARCH_GULP_TASKS = "searchGulpTasks";
TasksPanelConfiguration.SEARCH_CONDITION = "searchCondition";
TasksPanelConfiguration.SEARCH_SUB_FOLDERS_PATH = "searchSubFolders";
//# sourceMappingURL=configuration.js.map