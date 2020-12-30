'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const child_process = require("child_process");
/**
 * Helper funcion to open a folder in the user's file manager
 * @export
 * @param {string} folder folder to open
 */
function openFolderInExplorer(folder) {
    let command = null;
    switch (process.platform) {
        case 'linux':
            command = 'xdg-open ' + folder;
            break;
        case 'darwin':
            command = 'open ' + folder;
            break;
        case 'win32':
            command = 'explorer.exe ' + folder;
            break;
    }
    // executute open folder command
    if (command !== null) {
        child_process.exec(command);
    }
}
exports.openFolderInExplorer = openFolderInExplorer;
//# sourceMappingURL=fmutil.js.map