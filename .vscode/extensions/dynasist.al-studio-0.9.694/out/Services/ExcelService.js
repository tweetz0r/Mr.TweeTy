"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
const Application_1 = require("./../Application");
const aurelia_dependency_injection_1 = require("aurelia-dependency-injection");
const exceljs_1 = require("exceljs");
let ExcelService = class ExcelService {
    export(entries) {
        return __awaiter(this, void 0, void 0, function* () {
            let filename = yield Application_1.Application.ui.filepicker({
                'Excel': ['xlsx']
            });
            if (!filename) {
                return;
            }
            let workbook = new exceljs_1.Workbook();
            let worksheet = workbook.addWorksheet('ATDD');
            worksheet.columns = [];
            // Add an array of rows
            let rows = entries
                .map((m) => {
                return {};
            })
                .map(m => Object.values(m));
            worksheet.addRows(rows);
            yield workbook.xlsx.writeFile(filename);
        });
    }
};
ExcelService = __decorate([
    aurelia_dependency_injection_1.singleton(true)
], ExcelService);
exports.ExcelService = ExcelService;
//# sourceMappingURL=ExcelService.js.map