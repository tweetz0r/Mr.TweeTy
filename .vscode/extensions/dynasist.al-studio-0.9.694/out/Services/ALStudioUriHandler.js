"use strict";
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
const querystring = require("querystring");
const VSCommandService_1 = require("./VSCommandService");
class ALStudioUriHandler {
    handleUri(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            let q = querystring.parse(uri.query);
            switch (q.Command) {
                case 'Activate':
                    let encoded = Buffer.from(q.License, 'base64');
                    let licenseKey = encoded.toString('utf-8');
                    yield VSCommandService_1.VSCommandService.activate(licenseKey);
                    break;
            }
        });
    }
}
exports.ALStudioUriHandler = ALStudioUriHandler;
//# sourceMappingURL=ALStudioUriHandler.js.map