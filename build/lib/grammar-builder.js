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
exports.GrammarBuilder = void 0;
var interpreter_1 = require("./interpreter");
var rule_1 = require("./rule");
var GrammarBuilder = (function () {
    function GrammarBuilder(config, compilerState) {
        this.config = config;
        this.compilerState = compilerState;
        this.names = Object.create(null);
        this.interpreter = new interpreter_1.Interpreter(require('./nearley-language-bootstrapped.js'));
        this.state = {
            rules: [],
            body: [],
            customTokens: [],
            config: {},
            macros: {},
            start: '',
            version: 'unknown',
        };
        this.state.version = config.version || this.state.version;
    }
    GrammarBuilder.prototype.import = function (rules) {
        var e_1, _a;
        if (typeof rules == 'string') {
            var state = this.subGrammar(rules);
            this.merge(state);
            this.state.start = this.state.start || state.start;
            return;
        }
        rules = Array.isArray(rules) ? rules : [rules];
        try {
            for (var rules_1 = __values(rules), rules_1_1 = rules_1.next(); !rules_1_1.done; rules_1_1 = rules_1.next()) {
                var rule = rules_1_1.value;
                if ("body" in rule) {
                    if (!this.config.noscript) {
                        this.state.body.push(rule.body);
                    }
                }
                else if ("include" in rule) {
                    var resolver = rule.builtin ? this.compilerState.builtinResolver : this.compilerState.resolver;
                    var path = resolver.path(rule.include);
                    if (!this.compilerState.alreadycompiled.has(path)) {
                        this.compilerState.alreadycompiled.add(path);
                        var state = this.subGrammar(resolver.body(path));
                        this.merge(state);
                    }
                }
                else if ("macro" in rule) {
                    this.state.macros[rule.macro] = { args: rule.args, exprs: rule.exprs };
                }
                else if ("config" in rule) {
                    this.state.config[rule.config] = rule.value;
                }
                else {
                    this.buildRules(rule.name, rule.rules, {});
                    this.state.start = this.state.start || rule.name;
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
    };
    GrammarBuilder.prototype.export = function () {
        return this.state;
    };
    GrammarBuilder.prototype.subGrammar = function (grammar) {
        var builder = new GrammarBuilder(this.config, this.compilerState);
        builder.import(this.interpreter.run(grammar));
        return builder.export();
    };
    GrammarBuilder.prototype.merge = function (state) {
        this.state.rules = this.state.rules.concat(state.rules);
        this.state.body = this.state.body.concat(state.body);
        this.state.customTokens = this.state.customTokens.concat(state.customTokens);
        Object.assign(this.state.config, state.config);
        Object.assign(this.state.macros, state.macros);
    };
    GrammarBuilder.prototype.uuid = function (name) {
        this.names[name] = (this.names[name] || 0) + 1;
        return name + '$' + this.names[name];
    };
    GrammarBuilder.prototype.buildRules = function (name, rules, scope) {
        for (var i = 0; i < rules.length; i++) {
            var rule = this.buildRule(name, rules[i], scope);
            if (this.config.noscript) {
                rule.postprocess = null;
            }
            this.state.rules.push(rule);
        }
    };
    GrammarBuilder.prototype.buildRule = function (name, rule, scope) {
        var tokens = [];
        for (var i = 0; i < rule.tokens.length; i++) {
            var token = this.buildToken(name, rule.tokens[i], scope);
            if (token !== null) {
                tokens.push(token);
            }
        }
        return new rule_1.Rule(name, tokens, rule.postprocess);
    };
    GrammarBuilder.prototype.buildToken = function (name, token, scope) {
        if (typeof token === 'string') {
            return token === 'null' ? null : token;
        }
        if (token instanceof RegExp) {
            return token;
        }
        if ('literal' in token) {
            if (!token.literal.length) {
                return null;
            }
            if (token.literal.length === 1 || this.state.config.lexer) {
                return token;
            }
            return this.buildStringToken(name, token, scope);
        }
        if ('token' in token) {
            if (this.state.config.lexer) {
                var name_1 = token.token;
                if (this.state.customTokens.indexOf(name_1) === -1) {
                    this.state.customTokens.push(name_1);
                }
                return { token: "(".concat(this.state.config.lexer, ".has(").concat(JSON.stringify(name_1), ") ? {type: ").concat(JSON.stringify(name_1), "} : ").concat(name_1, ")") };
            }
            return token;
        }
        if ('subexpression' in token) {
            return this.buildSubExpressionToken(name, token, scope);
        }
        if ('ebnf' in token) {
            return this.buildEBNFToken(name, token, scope);
        }
        if ('macrocall' in token) {
            return this.buildMacroCallToken(name, token, scope);
        }
        if ('mixin' in token) {
            if (scope[token.mixin]) {
                return this.buildToken(name, scope[token.mixin], scope);
            }
            else {
                throw new Error("Unbound variable: " + token.mixin);
            }
        }
        throw new Error("unrecognized token: " + JSON.stringify(token));
    };
    GrammarBuilder.prototype.buildStringToken = function (name, token, scope) {
        var id = this.uuid(name + "$string");
        this.buildRules(id, [
            {
                tokens: token.literal.split("").map(function (literal) { return ({ literal: literal }); }),
                postprocess: { builtin: "joiner" }
            }
        ], scope);
        return id;
    };
    GrammarBuilder.prototype.buildSubExpressionToken = function (name, token, scope) {
        var id = this.uuid(name + "$subexpression");
        this.buildRules(id, token.subexpression, scope);
        return id;
    };
    GrammarBuilder.prototype.buildEBNFToken = function (name, token, scope) {
        var id = this.uuid(name + "$ebnf");
        var exprs;
        if (token.modifier == ':+') {
            exprs = [{
                    tokens: [token.ebnf],
                }, {
                    tokens: [id, token.ebnf],
                    postprocess: { builtin: "arrpush" }
                }];
        }
        else if (token.modifier == ':*') {
            exprs = [{
                    tokens: [],
                }, {
                    tokens: [id, token.ebnf],
                    postprocess: { builtin: "arrpush" }
                }];
        }
        else if (token.modifier == ':?') {
            exprs = [{
                    tokens: [token.ebnf],
                    postprocess: { builtin: "id" }
                }, {
                    tokens: [],
                    postprocess: { builtin: "nuller" }
                }];
        }
        this.buildRules(id, exprs, scope);
        return id;
    };
    GrammarBuilder.prototype.buildMacroCallToken = function (name, token, scope) {
        var id = this.uuid(name + "$macrocall");
        var macro = this.state.macros[token.macrocall];
        if (!macro) {
            throw new Error("Unkown macro: " + token.macrocall);
        }
        if (macro.args.length !== token.args.length) {
            throw new Error("Argument count mismatch.");
        }
        var newscope = { __proto__: scope };
        for (var i = 0; i < macro.args.length; i++) {
            var argrulename = this.uuid(name + "$macrocall");
            newscope[macro.args[i]] = argrulename;
            this.buildRules(argrulename, [token.args[i]], scope);
        }
        this.buildRules(id, macro.exprs, newscope);
        return id;
    };
    return GrammarBuilder;
}());
exports.GrammarBuilder = GrammarBuilder;
//# sourceMappingURL=grammar-builder.js.map