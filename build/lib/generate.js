"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generate = void 0;
const coffeescript_1 = require("../formats/coffeescript");
const javascript_1 = require("../formats/javascript");
const typescript_1 = require("../formats/typescript");
const Registry = {
    _default: javascript_1.JavascriptOutput,
    js: javascript_1.JavascriptOutput,
    javascript: javascript_1.JavascriptOutput,
    module: javascript_1.ESMOutput,
    esmodule: javascript_1.ESMOutput,
    cs: coffeescript_1.CoffeescriptOutput,
    coffee: coffeescript_1.CoffeescriptOutput,
    coffeescript: coffeescript_1.CoffeescriptOutput,
    ts: typescript_1.TypescriptFormat,
    typescript: typescript_1.TypescriptFormat
};
function Generate(parser, exportName) {
    if (!parser.config.preprocessor) {
        parser.config.preprocessor = "_default";
    }
    if (!Registry[parser.config.preprocessor]) {
        throw new Error("No such preprocessor: " + parser.config.preprocessor);
    }
    return Registry[parser.config.preprocessor](parser, exportName);
}
exports.Generate = Generate;
;
//# sourceMappingURL=generate.js.map