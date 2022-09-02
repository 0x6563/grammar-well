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
exports.Compiler = exports.Compile = void 0;
const import_resolver_1 = require("./import-resolver");
const generator_1 = require("./generator");
const javascript_1 = require("./outputs/javascript");
const typescript_1 = require("./outputs/typescript");
const json_1 = require("./outputs/json");
const OutputFormats = {
    _default: javascript_1.JavascriptOutput,
    object: (grammar, exportName) => ({ grammar, exportName }),
    json: json_1.JSONFormatter,
    js: javascript_1.JavascriptOutput,
    javascript: javascript_1.JavascriptOutput,
    module: javascript_1.ESMOutput,
    esmodule: javascript_1.ESMOutput,
    ts: typescript_1.TypescriptFormat,
    typescript: typescript_1.TypescriptFormat
};
function Compile(rules, config = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const compiler = new Compiler(config);
        yield compiler.import(rules);
        return compiler.export(config.format);
    });
}
exports.Compile = Compile;
class Compiler {
    constructor(config = {}) {
        this.state = {
            alreadycompiled: new Set(),
            resolver: config.resolverInstance ? config.resolverInstance : config.resolver ? new config.resolver(config.basedir) : new import_resolver_1.FileSystemResolver(config.basedir),
        };
        this.grammarBuilder = new generator_1.Generator(config, this.state);
    }
    import(val) {
        return this.grammarBuilder.import(val);
    }
    export(format, name = 'GWLanguage') {
        const grammar = this.grammarBuilder.export();
        const output = format || grammar.config.preprocessor || '_default';
        if (OutputFormats[output]) {
            return OutputFormats[output](grammar, name);
        }
        throw new Error("No such preprocessor: " + output);
    }
    ;
}
exports.Compiler = Compiler;
//# sourceMappingURL=compiler.js.map