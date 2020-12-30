"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableFinder = void 0;
const range_1 = require("../models/doc/range");
class TableFinder {
    constructor(_tableValidator) {
        this._tableValidator = _tableValidator;
    }
    getNextRange(document, startLine) {
        // look for the separator row, assume table starts 1 row before & ends when invalid
        let rowIndex = startLine;
        while (rowIndex < document.lines.length) {
            const isValidSeparatorRow = this._tableValidator.lineIsValidSeparator(document.lines[rowIndex].value);
            let tableRange = isValidSeparatorRow
                ? this.getNextValidTableRange(document, rowIndex)
                : null;
            if (tableRange != null) {
                return tableRange;
            }
            rowIndex++;
        }
        return null;
    }
    getNextValidTableRange(document, separatorRowIndex) {
        let firstTableFileRow = separatorRowIndex - 1;
        let lastTableFileRow = separatorRowIndex + 1;
        let selection = null;
        while (lastTableFileRow < document.lines.length) {
            const newSelection = document.getText(new range_1.Range(firstTableFileRow, lastTableFileRow));
            const tableValid = this._tableValidator.isValid(newSelection);
            if (tableValid) {
                selection = newSelection;
                lastTableFileRow++;
            }
            else {
                break;
            }
        }
        if (selection == null) {
            return null;
        }
        // return the row to the last valid try
        lastTableFileRow--;
        return new range_1.Range(firstTableFileRow, lastTableFileRow);
    }
}
exports.TableFinder = TableFinder;
//# sourceMappingURL=tableFinder.js.map