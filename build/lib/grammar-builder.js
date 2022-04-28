"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrammarBuilder = void 0;
const interpreter_1 = require("./interpreter");
const rule_1 = require("./rule");
const cow = require("../grammars/cow.json");
const number = require("../grammars/number.json");
const postprocessor = require("../grammars/postprocessors.json");
const nearley = require("../grammars/nearley.json");
const string = require("../grammars/string.json");
const whitespace = require("../grammars/whitespace.json");
const BuiltInRegistry = {
    'cow.ne': cow.grammar,
    'number.ne': number.grammar,
    'postprocessor.ne': postprocessor.grammar,
    'nearley.ne': nearley.grammar,
    'string.ne': string.grammar,
    'whitespace.ne': whitespace.grammar,
};
class GrammarBuilder {
    constructor(config, compilerState) {
        this.config = config;
        this.compilerState = compilerState;
        this.names = Object.create(null);
        this.interpreter = new interpreter_1.Interpreter(require('../grammars/nearley.js'));
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
    import(rules) {
        if (typeof rules == 'string') {
            const state = this.subGrammar(rules);
            this.merge(state);
            this.state.start = this.state.start || state.start;
            return;
        }
        rules = Array.isArray(rules) ? rules : [rules];
        for (const rule of rules) {
            if ("body" in rule) {
                if (!this.config.noscript) {
                    this.state.body.push(rule.body);
                }
            }
            else if ("include" in rule) {
                const resolver = rule.builtin ? this.compilerState.builtinResolver : this.compilerState.resolver;
                const path = resolver.path(rule.include);
                if (!this.compilerState.alreadycompiled.has(path)) {
                    this.compilerState.alreadycompiled.add(path);
                    const state = this.subGrammar(resolver.body(path));
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
    export() {
        return this.state;
    }
    subGrammar(grammar) {
        const builder = new GrammarBuilder(this.config, this.compilerState);
        builder.import(this.interpreter.run(grammar));
        return builder.export();
    }
    merge(state) {
        this.state.rules = this.state.rules.concat(state.rules);
        this.state.body = this.state.body.concat(state.body);
        this.state.customTokens = this.state.customTokens.concat(state.customTokens);
        Object.assign(this.state.config, state.config);
        Object.assign(this.state.macros, state.macros);
    }
    uuid(name) {
        this.names[name] = (this.names[name] || 0) + 1;
        return name + '$' + this.names[name];
    }
    buildRules(name, rules, scope) {
        for (let i = 0; i < rules.length; i++) {
            const rule = this.buildRule(name, rules[i], scope);
            if (this.config.noscript) {
                rule.postprocess = null;
            }
            this.state.rules.push(rule);
        }
    }
    buildRule(name, rule, scope) {
        const tokens = [];
        for (let i = 0; i < rule.tokens.length; i++) {
            const token = this.buildToken(name, rule.tokens[i], scope);
            if (token !== null) {
                tokens.push(token);
            }
        }
        return new rule_1.Rule(name, tokens, rule.postprocess);
    }
    buildToken(name, token, scope) {
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
                const name = token.token;
                if (this.state.customTokens.indexOf(name) === -1) {
                    this.state.customTokens.push(name);
                }
                return { token: `(${this.state.config.lexer}.has(${JSON.stringify(name)}) ? {type: ${JSON.stringify(name)}} : ${name})` };
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
    }
    buildStringToken(name, token, scope) {
        const id = this.uuid(name + "$string");
        this.buildRules(id, [
            {
                tokens: token.literal.split("").map((literal) => ({ literal })),
                postprocess: { builtin: "joiner" }
            }
        ], scope);
        return id;
    }
    buildSubExpressionToken(name, token, scope) {
        const id = this.uuid(name + "$subexpression");
        this.buildRules(id, token.subexpression, scope);
        return id;
    }
    buildEBNFToken(name, token, scope) {
        const id = this.uuid(name + "$ebnf");
        let exprs;
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
    }
    buildMacroCallToken(name, token, scope) {
        const id = this.uuid(name + "$macrocall");
        const macro = this.state.macros[token.macrocall];
        if (!macro) {
            throw new Error("Unkown macro: " + token.macrocall);
        }
        if (macro.args.length !== token.args.length) {
            throw new Error("Argument count mismatch.");
        }
        const newscope = { __proto__: scope };
        for (let i = 0; i < macro.args.length; i++) {
            const argrulename = this.uuid(name + "$macrocall");
            newscope[macro.args[i]] = argrulename;
            this.buildRules(argrulename, [token.args[i]], scope);
        }
        this.buildRules(id, macro.exprs, newscope);
        return id;
    }
}
exports.GrammarBuilder = GrammarBuilder;
//# sourceMappingURL=grammar-builder.js.map