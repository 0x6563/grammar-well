"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tokenizer = void 0;
var rule_1 = require("./rule");
var Tokenizer = (function () {
    function Tokenizer(config) {
        this.config = config;
        this.names = Object.create(null);
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
    Tokenizer.prototype.merge = function (state) {
        this.state.rules = this.state.rules.concat(state.rules);
        this.state.body = this.state.body.concat(state.body);
        this.state.customTokens = this.state.customTokens.concat(state.customTokens);
        Object.assign(this.state.config, state.config);
        Object.assign(this.state.macros, state.macros);
    };
    Tokenizer.prototype.feed = function (name, rules) {
        this.buildRules(name, rules, {});
        this.state.start = this.state.start || name;
    };
    Tokenizer.prototype.uuid = function (name) {
        this.names[name] = (this.names[name] || 0) + 1;
        return name + '$' + this.names[name];
    };
    Tokenizer.prototype.buildRules = function (name, rules, scope) {
        for (var i = 0; i < rules.length; i++) {
            var rule = this.buildRule(name, rules[i], scope);
            if (this.config.noscript) {
                rule.postprocess = null;
            }
            this.state.rules.push(rule);
        }
    };
    Tokenizer.prototype.buildRule = function (name, rule, scope) {
        var tokens = [];
        for (var i = 0; i < rule.tokens.length; i++) {
            var token = this.buildToken(name, rule.tokens[i], scope);
            if (token !== null) {
                tokens.push(token);
            }
        }
        return new rule_1.Rule(name, tokens, rule.postprocess);
    };
    Tokenizer.prototype.buildToken = function (name, token, scope) {
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
    Tokenizer.prototype.buildStringToken = function (name, token, scope) {
        var id = this.uuid(name + "$string");
        this.buildRules(id, [
            {
                tokens: token.literal.split("").map(function (literal) { return ({ literal: literal }); }),
                postprocess: { builtin: "joiner" }
            }
        ], scope);
        return id;
    };
    Tokenizer.prototype.buildSubExpressionToken = function (name, token, scope) {
        var id = this.uuid(name + "$subexpression");
        this.buildRules(id, token.subexpression, scope);
        return id;
    };
    Tokenizer.prototype.buildEBNFToken = function (name, token, scope) {
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
    Tokenizer.prototype.buildMacroCallToken = function (name, token, scope) {
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
    return Tokenizer;
}());
exports.Tokenizer = Tokenizer;
//# sourceMappingURL=tokenizer.js.map