'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const child_process = require("child_process");
/**
 * Helper funcion to open a folder in the user's file manager
 * @export
 * @param {string} folder folder to open
 */
function openFolderInExplorer(folder) {
    let command = "";
    switch (process.platform) {
        case 'linux':
            command = 'xdg-open';
            break;
        case 'darwin':
            command = 'open';
            break;
        case 'win32':
            command = 'explorer.exe';
            break;
    }
    // executute open folder command
    if (command) {
        child_process.spawn(command, [folder]);
    }
}
exports.openFolderInExplorer = openFolderInExplorer;
//# sourceMappingURL=fmutils.js.map