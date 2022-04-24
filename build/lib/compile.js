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
exports.Compile = void 0;
var path_1 = require("path");
var grammar_1 = require("./grammar");
var parser_1 = require("./parser");
var import_resolver_1 = require("./import-resolver");
var rule_1 = require("./rule");
function Compile(structure, opts) {
    var e_1, _a;
    var _b, _c;
    var unique = uniquer();
    if (!opts.alreadycompiled) {
        opts.alreadycompiled = new Set();
    }
    if (!opts.resolverInstance) {
        opts.resolverInstance = opts.resolver ? new opts.resolver((_b = opts === null || opts === void 0 ? void 0 : opts.args) === null || _b === void 0 ? void 0 : _b[0]) : new import_resolver_1.FileSystemResolver((_c = opts === null || opts === void 0 ? void 0 : opts.args) === null || _c === void 0 ? void 0 : _c[0]);
    }
    var builtInResolver = new import_resolver_1.FileSystemResolver((0, path_1.resolve)(__dirname, '../grammars/file.ne'));
    var result = {
        rules: [],
        body: [],
        customTokens: [],
        config: {},
        macros: {},
        start: '',
        version: opts.version || 'unknown'
    };
    try {
        for (var structure_1 = __values(structure), structure_1_1 = structure_1.next(); !structure_1_1.done; structure_1_1 = structure_1.next()) {
            var productionRule = structure_1_1.value;
            if (productionRule.body) {
                if (!opts.nojs) {
                    result.body.push(productionRule.body);
                }
            }
            else if (productionRule.include) {
                var resolver = productionRule.builtin ? builtInResolver : opts.resolverInstance;
                var path = resolver.path(productionRule.include);
                if (!opts.alreadycompiled.has(path)) {
                    opts.alreadycompiled.add(path);
                    var parserGrammar = grammar_1.Grammar.fromCompiled(require('./nearley-language-bootstrapped.js'));
                    var parser = new parser_1.Parser(parserGrammar);
                    parser.feed(resolver.body(path));
                    var c = Compile(parser.results[0], { args: [path], __proto__: opts });
                    result.rules = result.rules.concat(c.rules);
                    result.body = result.body.concat(c.body);
                    result.customTokens = result.customTokens.concat(c.customTokens);
                    Object.assign(result.config, c.config);
                    Object.assign(result.macros, c.macros);
                }
            }
            else if (productionRule.macro) {
                result.macros[productionRule.macro] = {
                    'args': productionRule.args,
                    'exprs': productionRule.exprs
                };
            }
            else if (productionRule.config) {
                result.config[productionRule.config] = productionRule.value;
            }
            else {
                produceRules(productionRule.name, productionRule.rules, {});
                result.start = result.start || productionRule.name;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (structure_1_1 && !structure_1_1.done && (_a = structure_1.return)) _a.call(structure_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return result;
    function produceRules(name, rules, env) {
        for (var i = 0; i < rules.length; i++) {
            var rule = buildRule(name, rules[i], env);
            if (opts.nojs) {
                rule.postprocess = null;
            }
            result.rules.push(rule);
        }
    }
    function buildRule(ruleName, rule, env) {
        var tokens = [];
        for (var i = 0; i < rule.tokens.length; i++) {
            var token = buildToken(ruleName, rule.tokens[i], env);
            if (token !== null) {
                tokens.push(token);
            }
        }
        return new rule_1.Rule(ruleName, tokens, rule.postprocess);
    }
    function buildToken(ruleName, token, env) {
        if (typeof token === 'string') {
            if (token === 'null') {
                return null;
            }
            return token;
        }
        if (token instanceof RegExp) {
            return token;
        }
        if (token.literal) {
            if (!token.literal.length) {
                return null;
            }
            if (token.literal.length === 1 || result.config.lexer) {
                return token;
            }
            return buildStringToken(ruleName, token, env);
        }
        if (token.token) {
            if (result.config.lexer) {
                var name = token.token;
                if (result.customTokens.indexOf(name) === -1) {
                    result.customTokens.push(name);
                }
                var expr = result.config.lexer + ".has(" + JSON.stringify(name) + ") ? {type: " + JSON.stringify(name) + "} : " + name;
                return { token: "(" + expr + ")" };
            }
            return token;
        }
        if (token.subexpression) {
            return buildSubExpressionToken(ruleName, token, env);
        }
        if (token.ebnf) {
            return buildEBNFToken(ruleName, token, env);
        }
        if (token.macrocall) {
            return buildMacroCallToken(ruleName, token, env);
        }
        if (token.mixin) {
            if (env[token.mixin]) {
                return buildToken(ruleName, env[token.mixin], env);
            }
            else {
                throw new Error("Unbound variable: " + token.mixin);
            }
        }
        throw new Error("unrecognized token: " + JSON.stringify(token));
    }
    function buildStringToken(ruleName, token, env) {
        var newname = unique(ruleName + "$string");
        produceRules(newname, [
            {
                tokens: token.literal.split("").map(function charLiteral(d) {
                    return {
                        literal: d
                    };
                }),
                postprocess: { builtin: "joiner" }
            }
        ], env);
        return newname;
    }
    function buildSubExpressionToken(ruleName, token, env) {
        var data = token.subexpression;
        var name = unique(ruleName + "$subexpression");
        produceRules(name, data, env);
        return name;
    }
    function buildEBNFToken(ruleName, token, env) {
        switch (token.modifier) {
            case ":+":
                return buildEBNFPlus(ruleName, token, env);
            case ":*":
                return buildEBNFStar(ruleName, token, env);
            case ":?":
                return buildEBNFOpt(ruleName, token, env);
        }
    }
    function buildEBNFPlus(ruleName, token, env) {
        var name = unique(ruleName + "$ebnf");
        produceRules(name, [{
                tokens: [token.ebnf],
            }, {
                tokens: [name, token.ebnf],
                postprocess: { builtin: "arrpush" }
            }], env);
        return name;
    }
    function buildEBNFStar(ruleName, token, env) {
        var name = unique(ruleName + "$ebnf");
        produceRules(name, [{
                tokens: [],
            }, {
                tokens: [name, token.ebnf],
                postprocess: { builtin: "arrpush" }
            }], env);
        return name;
    }
    function buildEBNFOpt(ruleName, token, env) {
        var name = unique(ruleName + "$ebnf");
        produceRules(name, [{
                tokens: [token.ebnf],
                postprocess: { builtin: "id" }
            }, {
                tokens: [],
                postprocess: { builtin: "nuller" }
            }], env);
        return name;
    }
    function buildMacroCallToken(ruleName, token, env) {
        var name = unique(ruleName + "$macrocall");
        var macro = result.macros[token.macrocall];
        if (!macro) {
            throw new Error("Unkown macro: " + token.macrocall);
        }
        if (macro.args.length !== token.args.length) {
            throw new Error("Argument count mismatch.");
        }
        var newenv = { __proto__: env };
        for (var i = 0; i < macro.args.length; i++) {
            var argrulename = unique(ruleName + "$macrocall");
            newenv[macro.args[i]] = argrulename;
            produceRules(argrulename, [token.args[i]], env);
        }
        produceRules(name, macro.exprs, newenv);
        return name;
    }
}
exports.Compile = Compile;
function uniquer() {
    var uns = {};
    return function unique(name) {
        var un = uns[name] = (uns[name] || 0) + 1;
        return name + '$' + un;
    };
}
//# sourceMappingURL=compile.js.map