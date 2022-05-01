"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compiler = exports.Compile = void 0;
const path_1 = require("path");
const import_resolver_1 = require("./import-resolver");
const grammar_builder_1 = require("./grammar-builder");
const coffeescript_1 = require("../formats/coffeescript");
const javascript_1 = require("../formats/javascript");
const typescript_1 = require("../formats/typescript");
const json_1 = require("../formats/json");
const OutputFormats = {
    _default: javascript_1.JavascriptOutput,
    object: (grammar, exportName) => ({ grammar, exportName }),
    json: json_1.JSONFormatter,
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
function Compile(rules, config = {}) {
    const compiler = new Compiler(config);
    compiler.import(rules);
    return compiler.export(config.format);
}
exports.Compile = Compile;
class Compiler {
    constructor(config = {}) {
        this.state = {
            alreadycompiled: new Set(),
            resolver: config.resolver ? new config.resolver(config.basedir) : new import_resolver_1.FileSystemResolver(config.basedir),
            builtinResolver: new import_resolver_1.FileSystemResolver((0, path_1.resolve)(__dirname, '../grammars/file.ne'))
        };
        this.grammarBuilder = new grammar_builder_1.GrammarBuilder(config, this.state);
    }
    import(val) {
        this.grammarBuilder.import(val);
    }
    export(format, name = 'grammar') {
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
//# sourceMappingURL=compile.js.map