"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cliPrettify_1 = require("./cliPrettify");
const inputReader_1 = require("./inputReader");
const checkOnly = process.argv.length > 2 || process.argv.find(arg => arg === "--check");
inputReader_1.InputReader.subscribe(input => checkOnly
    ? cliPrettify_1.CliPrettify.check(input)
    : process.stdout.write(cliPrettify_1.CliPrettify.prettify(input)));
//# sourceMappingURL=index.js.map