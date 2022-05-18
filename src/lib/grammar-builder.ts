import { Dictionary, EBNFModified, Expression, ExpressionToken, GrammarBuilderRule, LexerToken, MacroCall, RuleDefinition, RuleDefinitionList, SubExpression, TokenLiteral } from "../typings";
import { CompilerState } from "./compiler";
import { Interpreter } from "./interpreter";

import * as cow from '../grammars/cow.json';
import * as number from '../grammars/number.json';
import * as postprocessor from '../grammars/postprocessors.json';
import * as nearley from '../grammars/nearley.json';
import * as string from '../grammars/string.json';
import * as whitespace from '../grammars/whitespace.json';

const BuiltInRegistry = {
    'cow.ne': cow,
    'number.ne': number,
    'postprocessor.ne': postprocessor,
    'nearley.ne': nearley,
    'string.ne': string,
    'whitespace.ne': whitespace,
}

export interface GrammarBuilderState {
    rules: GrammarBuilderRule[],
    body: string[], // @directives list
    customTokens: Set<string>, // %tokens
    config: Dictionary<string>, // @config value
    macros: Dictionary<{ args: any, exprs: any }>,
    start: string;
    version: string;
}

export interface SerializedGrammarBuilderState extends Omit<GrammarBuilderState, 'customTokens'> {
    customTokens: string[];
}

export class GrammarBuilder {
    private names = Object.create(null);
    private neInterpreter = new Interpreter(require('../grammars/nearley.js'));
    private grmrInterpreter = new Interpreter(require('../grammars/grammar-well.js'));

    private state: GrammarBuilderState = {
        rules: [],
        body: [], // @directives list
        customTokens: new Set(), // %tokens
        config: {}, // @config value
        macros: {},
        start: '',
        version: 'unknown',
    }

    constructor(private config: { noscript?: boolean; version?: string }, private compilerState: CompilerState) {
        this.state.version = config.version || this.state.version;
    }


    async import(source: string, language: 'nearley' | 'grammar-well'): Promise<void>
    async import(rule: RuleDefinition): Promise<void>
    async import(rules: RuleDefinitionList): Promise<void>
    async import(rules: string | RuleDefinition | RuleDefinitionList, language?: 'nearley' | 'grammar-well'): Promise<void>
    async import(rules: string | RuleDefinition | RuleDefinitionList, language: 'nearley' | 'grammar-well' = 'grammar-well'): Promise<void> {
        if (typeof rules == 'string') {
            const state = await this.mergeGrammarString(rules, language);
            this.state.start = this.state.start || state.start;
            return;
        }
        rules = Array.isArray(rules) ? rules : [rules];
        for (const rule of rules) {
            if ("body" in rule) {
                if (this.config.noscript)
                    continue;
                this.state.body.push(rule.body);
            } else if ("include" in rule) {
                if (rule.builtin) {
                    this.includeBuiltIn(rule.include);
                } else {
                    await this.includeGrammar(rule.include);
                }
            } else if ("macro" in rule) {
                this.state.macros[rule.macro] = { args: rule.args, exprs: rule.exprs };
            } else if ("config" in rule) {
                this.state.config[rule.config] = rule.value
            } else {
                this.buildRules(rule.name, rule.rules, {});
                this.state.start = this.state.start || rule.name;
            }
        }
    }

    export() {
        return this.state;
    }

    private includeBuiltIn(name: string) {
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

    private async includeGrammar(name) {
        const resolver = this.compilerState.resolver;
        const path = resolver.path(name);
        if (!this.compilerState.alreadycompiled.has(path)) {
            this.compilerState.alreadycompiled.add(path);
            await this.mergeGrammarString(await resolver.body(path), path.slice(-3) === '.ne' ? 'nearley' : 'grammar-well')
        }
    }

    private async mergeGrammarString(body: string, language: 'nearley' | 'grammar-well' = 'grammar-well') {
        const builder = new GrammarBuilder(this.config, this.compilerState);
        if (language == 'nearley') {
            await builder.import(this.neInterpreter.run(body));
        } else {
            await builder.import(this.grmrInterpreter.run(body));
        }
        const state = builder.export();
        this.merge(state);
        return state;
    }

    private merge(state: GrammarBuilderState) {
        this.state.rules.push(...state.rules);
        this.state.body.push(...state.body);
        state.customTokens.forEach(s => this.state.customTokens.add(s));
        Object.assign(this.state.config, state.config);
        Object.assign(this.state.macros, state.macros);
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
                rule.transform = null;
            }
            this.state.rules.push(rule);
        }
    }

    private buildRule(name: string, rule: Expression, scope: Dictionary<string>): GrammarBuilderRule {
        const symbols: (string | RegExp | TokenLiteral | LexerToken)[] = [];
        for (let i = 0; i < rule.tokens.length; i++) {
            const symbol = this.buildSymbol(name, rule.tokens[i], scope);
            if (symbol !== null) {
                symbols.push(symbol);
            }
        }
        return { name, symbols, postprocess: rule.postprocess, transform: rule.transform };
    }

    private buildSymbol(name: string, token: ExpressionToken, scope: Dictionary<string>): string | RegExp | TokenLiteral | LexerToken | null {
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
        let expr1: Expression = { tokens: [] };
        let expr2: Expression = { tokens: [] };
        if (token.modifier == ':+') {
            expr1.tokens = [token.ebnf];
            expr2.tokens = [id, token.ebnf];
            expr2.postprocess = { builtin: "arrpush" };
        } else if (token.modifier == ':*') {
            expr2.tokens = [id, token.ebnf];
            expr2.postprocess = { builtin: "arrpush" };
        } else if (token.modifier == ':?') {
            expr1.tokens = [token.ebnf];
            expr1.postprocess = { builtin: "id" };
            expr2.postprocess = { builtin: "nuller" };
        }
        this.buildRules(id, [expr1, expr2], scope);
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
