"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compiler = exports.Compile = void 0;
var path_1 = require("path");
var import_resolver_1 = require("./import-resolver");
var grammar_builder_1 = require("./grammar-builder");
var coffeescript_1 = require("../formats/coffeescript");
var javascript_1 = require("../formats/javascript");
var typescript_1 = require("../formats/typescript");
var OutputFormats = {
    '{}': function (grammar, exportName) { return ({ grammar: grammar, exportName: exportName }); },
    json: function (grammar, exportName) { return JSON.stringify({ grammar: grammar, exportName: exportName }); },
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
function Compile(rules, config) {
    if (config === void 0) { config = {}; }
    var compiler = new Compiler(config);
    compiler.import(rules);
    return compiler.export();
}
exports.Compile = Compile;
var Compiler = (function () {
    function Compiler(config) {
        if (config === void 0) { config = {}; }
        this.state = {
            alreadycompiled: new Set(),
            resolver: config.resolver ? new config.resolver(config.basedir) : new import_resolver_1.FileSystemResolver(config.basedir),
            builtinResolver: new import_resolver_1.FileSystemResolver((0, path_1.resolve)(__dirname, '../grammars/file.ne'))
        };
        this.grammarBuilder = new grammar_builder_1.GrammarBuilder(config, this.state);
    }
    Compiler.prototype.import = function (val) {
        this.grammarBuilder.import(val);
    };
    Compiler.prototype.export = function (format, name) {
        var grammar = this.grammarBuilder.export();
        var output = format || grammar.config.preprocessor || '_default';
        if (OutputFormats[output]) {
            return OutputFormats[output](grammar, name);
        }
        throw new Error("No such preprocessor: " + output);
    };
    ;
    return Compiler;
}());
exports.Compiler = Compiler;
//# sourceMappingURL=compile.js.map