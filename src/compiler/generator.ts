import { CompilerState, ConfigDirective, Dictionary, EBNFModified, Expression, ExpressionToken, GeneratorState, GrammarBuilderRule, GrammarDirective, ImportDirective, LexerDirective, LexerTokenMatch, LanguageDirective, SubExpression, TokenLiteral } from "../typings";
import { Parser } from "../parser/parser";

import * as number from '../grammars/number.json';
import * as string from '../grammars/string.json';
import * as whitespace from '../grammars/whitespace.json';
import Language from '../grammars/gwell';

const BuiltInRegistry = {
    number,
    string,
    whitespace,
}

export class Generator {
    private parser = new Parser(Language(), { algorithm: 'earley' });

    private state: GeneratorState = {
        grammar: {
            start: '',
            rules: [],
            names: Object.create(null)
        },
        lexer: null,
        head: [],
        body: [],
        config: {},
        version: 'unknown',
    }

    constructor(private config: { noscript?: boolean; version?: string }, private compilerState: CompilerState) {
        this.state.version = config.version || this.state.version;
    }


    async import(source: string): Promise<void>
    async import(directive: LanguageDirective): Promise<void>
    async import(directives: LanguageDirective): Promise<void>
    async import(directives: string | LanguageDirective | LanguageDirective[]): Promise<void> {
        if (typeof directives == 'string') {
            await this.mergeLanguageDefinitionString(directives);
            return;
        }
        directives = Array.isArray(directives) ? directives : [directives];
        for (const directive of directives) {
            if ("head" in directive) {
                if (this.config.noscript)
                    continue;
                this.state.head.push(directive.head);
            } else if ("body" in directive) {
                if (this.config.noscript)
                    continue;
                this.state.body.push(directive.body);
            } else if ("import" in directive) {
                await this.processImportDirective(directive);
            } else if ("config" in directive) {
                this.processConfigDirective(directive);
            } else if ("grammar" in directive) {
                this.processGrammarDirective(directive);
            } else if ("lexer" in directive) {
                this.processLexerDirective(directive);
            }
        }
    }

    export() {
        return this.state;
    }

    private async processImportDirective(directive: ImportDirective) {
        if (directive.builtin) {
            this.importBuiltIn(directive.import);
        } else {
            await this.importGrammar(directive.import);
        }
    }

    private processConfigDirective(directive: ConfigDirective) {
        Object.assign(this.state.config, directive.config);
    }

    private processGrammarDirective(directive: GrammarDirective) {
        for (const rule of directive.grammar.rules) {
            this.buildRules(rule.name, rule.rules, {});
            this.state.grammar.start = this.state.grammar.start || rule.name;
        }
    }

    private processLexerDirective(directive: LexerDirective) {
        if (!this.state.lexer) {
            this.state.lexer = {
                start: '',
                states: []
            };
        }
        this.state.lexer.start = directive.lexer.start || this.state.lexer.start;
        this.state.lexer.states.push(...directive.lexer.states);
    }


    private importBuiltIn(name: string) {
        name = name.toLowerCase();
        if (!this.compilerState.alreadycompiled.has(name)) {
            this.compilerState.alreadycompiled.add(name);
            if (!BuiltInRegistry[name])
                return;
            this.merge(BuiltInRegistry[name].state);
        }
    }

    private async importGrammar(name) {
        const resolver = this.compilerState.resolver;
        const path = resolver.path(name);
        if (!this.compilerState.alreadycompiled.has(path)) {
            this.compilerState.alreadycompiled.add(path);
            await this.mergeLanguageDefinitionString(await resolver.body(path))
        }
    }

    private async mergeLanguageDefinitionString(body: string) {
        const builder = new Generator(this.config, this.compilerState);
        await builder.import(this.parser.run(body));
        const state = builder.export();
        this.merge(state);
        return state;
    }

    private merge(state: GeneratorState) {

        this.state.grammar.rules.push(...state.grammar.rules)
        this.state.grammar.start = state.grammar.start || this.state.grammar.start;
        if (state.lexer) {
            if (this.state.lexer) {
                this.state.lexer.states.push(...state.lexer.states);
                this.state.lexer.start = state.lexer.start || this.state.lexer.start;
            } else {
                this.state.lexer = state.lexer;
            }
        }
        this.state.head.push(...state.head);
        this.state.body.push(...state.body);
        Object.assign(this.state.config, state.config);
    }

    private uuid(name: string) {
        this.state.grammar.names[name] = (this.state.grammar.names[name] || 0) + 1;
        return name + '$' + this.state.grammar.names[name];
    }

    private buildRules(name: string, rules: Expression[], scope: Dictionary<string>) {
        for (let i = 0; i < rules.length; i++) {
            const rule = this.buildRule(name, rules[i], scope);
            if (this.config.noscript) {
                rule.postprocess = null;
            }
            this.state.grammar.rules.push(rule);
        }
    }

    private buildRule(name: string, rule: Expression, scope: Dictionary<string>): GrammarBuilderRule {
        const symbols: (string | RegExp | TokenLiteral | LexerTokenMatch)[] = [];
        for (let i = 0; i < rule.tokens.length; i++) {
            const symbol = this.buildSymbol(name, rule.tokens[i], scope);
            if (symbol !== null) {
                symbols.push(symbol);
            }
        }
        return { name, symbols, postprocess: rule.postprocess };
    }

    private buildSymbol(name: string, token: ExpressionToken, scope: Dictionary<string>): string | RegExp | TokenLiteral | LexerTokenMatch | null {
        if (typeof token === 'string') {
            return token === 'null' ? null : token;
        }
        if ('regex' in token) {
            return token;
        }
        if ('literal' in token) {
            if (!token.literal.length) {
                return null;
            }
            if (token.literal.length === 1 || this.state.lexer) {
                return token;
            }
            return this.buildStringToken(name, token, scope);
        }
        if ('token' in token) {
            const name = token.token;
            return { token: `{ type: ${JSON.stringify(name)}}` };
        }
        if ('subexpression' in token) {
            return this.buildSubExpressionToken(name, token, scope);
        }
        if ('ebnf' in token) {
            return this.buildEBNFToken(name, token, scope);
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
        if (token.modifier == '+') {
            expr1.tokens = [token.ebnf];
            expr2.tokens = [id, token.ebnf];
            expr2.postprocess = { builtin: "arrpush" };
        } else if (token.modifier == '*') {
            expr2.tokens = [id, token.ebnf];
            expr2.postprocess = { builtin: "arrpush" };
        } else if (token.modifier == '?') {
            expr1.tokens = [token.ebnf];
            expr1.postprocess = { builtin: "id" };
            expr2.postprocess = { builtin: "nuller" };
        }
        this.buildRules(id, [expr1, expr2], scope);
        return id;
    }
}
