import { Dictionary, EBNFModified, Expression, ExpressionToken, LexerToken, MacroCall, SubExpression, TokenLiteral } from "../typings";
import { Rule } from "./rule";

export interface TokenizerState {
    rules: any[],
    body: any[], // @directives list
    customTokens: any[], // %tokens
    config: any, // @config value
    macros: {},
    start: string;
    version: string;
}

export class Tokenizer {
    private names = Object.create(null);
    state: TokenizerState = {
        rules: [],
        body: [], // @directives list
        customTokens: [], // %tokens
        config: {}, // @config value
        macros: {},
        start: '',
        version: 'unknown',
    }

    constructor(private config: { noscript?: boolean; version?: string }) {
        this.state.version = config.version || this.state.version;
    }

    


    merge(state: TokenizerState) {
        this.state.rules = this.state.rules.concat(state.rules);
        this.state.body = this.state.body.concat(state.body);
        this.state.customTokens = this.state.customTokens.concat(state.customTokens);
        Object.assign(this.state.config, state.config);
        Object.assign(this.state.macros, state.macros);
    }

    feed(name: string, rules: Expression[]) {
        this.buildRules(name, rules, {});
        this.state.start = this.state.start || name;
    }

    private uuid(name: string) {
        this.names[name] = (this.names[name] || 0) + 1;
        return name + '$' + this.names[name];
    }

    private buildRules(name: string, rules: Expression[], scope: Dictionary<string>) {
        for (let i = 0; i < rules.length; i++) {
            const rule = this.buildRule(name, rules[i], scope);
            if (this.config.noscript) {
                rule.postprocess = null;
            }
            this.state.rules.push(rule);
        }
    }

    private buildRule(name: string, rule: Expression, scope: Dictionary<string>) {
        const tokens: (string | RegExp | TokenLiteral | LexerToken)[] = [];
        for (let i = 0; i < rule.tokens.length; i++) {
            const token = this.buildToken(name, rule.tokens[i], scope);
            if (token !== null) {
                tokens.push(token);
            }
        }
        return new Rule(name, tokens, rule.postprocess);
    }

    private buildToken(name: string, token: ExpressionToken, scope: Dictionary<string>): string | RegExp | TokenLiteral | LexerToken | null {
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
            } else {
                throw new Error("Unbound variable: " + token.mixin);
            }
        }

        throw new Error("unrecognized token: " + JSON.stringify(token));
    }

    private buildStringToken(name: string, token: TokenLiteral, scope: Dictionary<string>) {
        const id = this.uuid(name + "$string");
        this.buildRules(id, [
            {
                tokens: token.literal.split("").map((literal) => ({ literal })),
                postprocess: { builtin: "joiner" }
            }
        ], scope);
        return id;
    }

    private buildSubExpressionToken(name: string, token: SubExpression, scope: Dictionary<string>) {
        const id = this.uuid(name + "$subexpression");
        this.buildRules(id, token.subexpression, scope);
        return id;
    }

    private buildEBNFToken(name: string, token: EBNFModified, scope: Dictionary<string>) {
        const id = this.uuid(name + "$ebnf");
        let exprs;
        if (token.modifier == ':+') {
            exprs = [{
                tokens: [token.ebnf],
            }, {
                tokens: [id, token.ebnf],
                postprocess: { builtin: "arrpush" }
            }];
        } else if (token.modifier == ':*') {
            exprs = [{
                tokens: [],
            }, {
                tokens: [id, token.ebnf],
                postprocess: { builtin: "arrpush" }
            }]
        } else if (token.modifier == ':?') {
            exprs = [{
                tokens: [token.ebnf],
                postprocess: { builtin: "id" }
            }, {
                tokens: [],
                postprocess: { builtin: "nuller" }
            }]
        }
        this.buildRules(id, exprs, scope);
        return id;
    }

    private buildMacroCallToken(name: string, token: MacroCall, scope: Dictionary<string>) {
        const id = this.uuid(name + "$macrocall");
        const macro = this.state.macros[token.macrocall];
        if (!macro) {
            throw new Error("Unkown macro: " + token.macrocall);
        }
        if (macro.args.length !== token.args.length) {
            throw new Error("Argument count mismatch.");
        }
        const newscope: Dictionary<string> = { __proto__: scope } as any;
        for (let i = 0; i < macro.args.length; i++) {
            const argrulename = this.uuid(name + "$macrocall");
            newscope[macro.args[i]] = argrulename;
            this.buildRules(argrulename, [token.args[i]] as any, scope);
        }
        this.buildRules(id, macro.exprs, newscope);
        return id;
    }
}
