"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrammarBuilder = void 0;
const interpreter_1 = require("./interpreter");
const cow = require("../grammars/cow.json");
const number = require("../grammars/number.json");
const postprocessor = require("../grammars/postprocessors.json");
const nearley = require("../grammars/nearley.json");
const string = require("../grammars/string.json");
const whitespace = require("../grammars/whitespace.json");
const BuiltInRegistry = {
    'cow.ne': cow,
    'number.ne': number,
    'postprocessor.ne': postprocessor,
    'nearley.ne': nearley,
    'string.ne': string,
    'whitespace.ne': whitespace,
};
class GrammarBuilder {
    constructor(config, compilerState) {
        this.config = config;
        this.compilerState = compilerState;
        this.names = Object.create(null);
        this.neInterpreter = new interpreter_1.Interpreter(require('../grammars/nearley.js'));
        this.grmrInterpreter = new interpreter_1.Interpreter(require('../grammars/grammar-well.js'));
        this.state = {
            rules: [],
            body: [],
            customTokens: new Set(),
            config: {},
            macros: {},
            start: '',
            version: 'unknown',
        };
        this.state.version = config.version || this.state.version;
    }
    import(rules, language = 'grammar-well') {
        if (typeof rules == 'string') {
            const state = this.mergeGrammarString(rules, language);
            this.state.start = this.state.start || state.start;
            return;
        }
        rules = Array.isArray(rules) ? rules : [rules];
        for (const rule of rules) {
            if ("body" in rule) {
                if (this.config.noscript)
                    continue;
                this.state.body.push(rule.body);
            }
            else if ("include" in rule) {
                if (rule.builtin) {
                    this.includeBuiltIn(rule.include);
                }
                else {
                    this.includeGrammar(rule.include);
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
    includeBuiltIn(name) {
        name = name.toLowerCase();
        if (!this.compilerState.alreadycompiled.has(name)) {
            this.compilerState.alreadycompiled.add(name);
            if (!BuiltInRegistry[name])
                return;
            const { grammar } = BuiltInRegistry[name];
            for (const { symbols } of grammar.rules) {
                for (let i = 0; i < symbols.length; i++) {
                    const symbol = symbols[i];
                    if (typeof symbol === 'object' && "regex" in symbol) {
                        symbols[i] = new RegExp(symbol.regex.source, symbol.regex.flags);
                    }
                }
            }
            this.merge(BuiltInRegistry[name].grammar);
        }
    }
    includeGrammar(name) {
        const resolver = this.compilerState.resolver;
        const path = resolver.path(name);
        if (!this.compilerState.alreadycompiled.has(path)) {
            this.compilerState.alreadycompiled.add(path);
            this.mergeGrammarString(resolver.body(path), path.slice(-3) === '.ne' ? 'nearley' : 'grammar-well');
        }
    }
    mergeGrammarString(body, language = 'grammar-well') {
        const builder = new GrammarBuilder(this.config, this.compilerState);
        if (language == 'nearley') {
            builder.import(this.neInterpreter.run(body));
        }
        else {
            builder.import(this.grmrInterpreter.run(body));
        }
        const state = builder.export();
        this.merge(state);
        return state;
    }
    merge(state) {
        this.state.rules.push(...state.rules);
        this.state.body.push(...state.body);
        state.customTokens.forEach(s => this.state.customTokens.add(s));
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
                rule.transform = null;
            }
            this.state.rules.push(rule);
        }
    }
    buildRule(name, rule, scope) {
        const symbols = [];
        for (let i = 0; i < rule.tokens.length; i++) {
            const symbol = this.buildSymbol(name, rule.tokens[i], scope);
            if (symbol !== null) {
                symbols.push(symbol);
            }
        }
        return { name, symbols, postprocess: rule.postprocess, transform: rule.transform };
    }
    buildSymbol(name, token, scope) {
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
                this.state.customTokens.add(name);
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
                return this.buildSymbol(name, scope[token.mixin], scope);
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
        let expr1 = { tokens: [] };
        let expr2 = { tokens: [] };
        if (token.modifier == ':+') {
            expr1.tokens = [token.ebnf];
            expr2.tokens = [id, token.ebnf];
            expr2.postprocess = { builtin: "arrpush" };
        }
        else if (token.modifier == ':*') {
            expr2.tokens = [id, token.ebnf];
            expr2.postprocess = { builtin: "arrpush" };
        }
        else if (token.modifier == ':?') {
            expr1.tokens = [token.ebnf];
            expr1.postprocess = { builtin: "id" };
            expr2.postprocess = { builtin: "nuller" };
        }
        this.buildRules(id, [expr1, expr2], scope);
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