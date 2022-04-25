"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compiler = exports.Compile = void 0;
var path_1 = require("path");
var grammar_1 = require("./grammar");
var parser_1 = require("./parser");
var import_resolver_1 = require("./import-resolver");
var tokenizer_1 = require("./tokenizer");
function Compile(rules, config) {
    return Compiler(rules, config, {
        alreadycompiled: new Set(),
        resolver: config.resolver ? new config.resolver(config.basedir) : new import_resolver_1.FileSystemResolver(config.basedir),
        builtinResolver: new import_resolver_1.FileSystemResolver((0, path_1.resolve)(__dirname, '../grammars/file.ne'))
    });
}
exports.Compile = Compile;
function Compiler(rules, config, state) {
    var e_1, _a;
    var tokenizer = new tokenizer_1.Tokenizer(config);
    try {
        for (var rules_1 = __values(rules), rules_1_1 = rules_1.next(); !rules_1_1.done; rules_1_1 = rules_1.next()) {
            var rule = rules_1_1.value;
            if ("body" in rule) {
                if (!config.noscript) {
                    tokenizer.state.body.push(rule.body);
                }
            }
            else if ("include" in rule) {
                var resolver = rule.builtin ? state.builtinResolver : state.resolver;
                var path = resolver.path(rule.include);
                if (!state.alreadycompiled.has(path)) {
                    state.alreadycompiled.add(path);
                    var grammar = grammar_1.Grammar.fromCompiled(require('./nearley-language-bootstrapped.js'));
                    var parser = new parser_1.Parser(grammar);
                    parser.feed(resolver.body(path));
                    tokenizer.merge(Compiler(parser.results[0], config, state));
                }
            }
            else if ("macro" in rule) {
                tokenizer.state.macros[rule.macro] = { args: rule.args, exprs: rule.exprs };
            }
            else if ("config" in rule) {
                tokenizer.state.config[rule.config] = rule.value;
            }
            else {
                tokenizer.feed(rule.name, rule.rules);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (rules_1_1 && !rules_1_1.done && (_a = rules_1.return)) _a.call(rules_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return tokenizer.state;
}
exports.Compiler = Compiler;
//# sourceMappingURL=compile.js.map