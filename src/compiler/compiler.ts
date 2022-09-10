import { CompileOptions, CompilerContext, OutputFormat, LanguageDirective, GeneratorState, ConfigDirective, GrammarBuilderSymbolRepeat, GrammarBuilderExpression, GeneratorGrammarRule, GrammarDirective, ImportDirective, LexerDirective, GrammarBuilderSymbolSubexpression, GrammarTypeLiteral, GeneratorGrammarSymbol, GrammarBuilderSymbol, LexerStateDefinition, GrammarBuilderRule } from "../typings";

import { Parser } from "../parser/parser";
import { FileSystemResolver } from "./import-resolver";
import Language from '../grammars/gwell';

import { ESMOutput, JavascriptOutput } from "./outputs/javascript";
import { TypescriptFormat } from "./outputs/typescript";
import { JSONFormatter } from "./outputs/json";

import * as number from '../grammars/number.json';
import * as string from '../grammars/string.json';
import * as whitespace from '../grammars/whitespace.json';

const BuiltInRegistry = {
    number,
    string,
    whitespace,
}
const OutputFormats = {
    _default: JavascriptOutput,
    object: (grammar, exportName) => ({ grammar, exportName }),
    json: JSONFormatter,
    js: JavascriptOutput,
    javascript: JavascriptOutput,
    module: ESMOutput,
    esmodule: ESMOutput,
    ts: TypescriptFormat,
    typescript: TypescriptFormat
}

export async function Compile(rules: string | LanguageDirective | (LanguageDirective[]), config: CompileOptions = {}) {
    const compiler = new Compiler(config);
    await compiler.import(rules as any);
    return compiler.export(config.format);
}

export class Compiler {
    private parser = new Parser(Language());
    private context: CompilerContext;

    state: GeneratorState = {
        grammar: {
            start: '',
            rules: {},
            names: Object.create(null)
        },
        lexer: null,
        head: [],
        body: [],
        config: {},
        version: 'unknown',
    }

    constructor(private config: CompileOptions = {}, context?: CompilerContext) {
        this.context = context || {
            alreadycompiled: new Set(),
            resolver: config.resolverInstance ? config.resolverInstance : config.resolver ? new config.resolver(config.basedir) : new FileSystemResolver(config.basedir),
        }
    }

    export<T extends OutputFormat = '_default'>(format: T, name: string = 'GWLanguage'): ReturnType<typeof OutputFormats[T]> {
        const grammar = this.state;
        const output = format || grammar.config.preprocessor || '_default';
        if (OutputFormats[output]) {
            return OutputFormats[output](grammar, name);
        }
        throw new Error("No such preprocessor: " + output)
    };

    async import(source: string): Promise<void>
    async import(directive: LanguageDirective): Promise<void>
    async import(directives: LanguageDirective[]): Promise<void>
    async import(directives: string | LanguageDirective | (LanguageDirective[])): Promise<void> {
        if (typeof directives == 'string') {
            await this.mergeLanguageDefinitionString(directives);
            return;
        }
        directives = Array.isArray(directives) ? directives : [directives];
        for (const directive of directives) {
            if ("head" in directive) {
                if (this.config.noscript)
                    continue;
                this.state.head.push(directive.head.js);
            } else if ("body" in directive) {
                if (this.config.noscript)
                    continue;
                this.state.body.push(directive.body.js);
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

    private async processImportDirective(directive: ImportDirective) {
        if (directive.path) {
            await this.importGrammar(directive.import);
        } else {
            this.importBuiltIn(directive.import);
        }
    }

    private processConfigDirective(directive: ConfigDirective) {
        Object.assign(this.state.config, directive.config);
    }

    private processGrammarDirective(directive: GrammarDirective) {
        if (directive.grammar.config) {
            this.state.grammar.start = directive.grammar.config.start || this.state.grammar.start;
        }

        for (const rule of directive.grammar.rules) {
            this.buildRules(rule.name, rule.expressions, rule);
            this.state.grammar.start = this.state.grammar.start || rule.name;
        }
    }

    private processLexerDirective(directive: LexerDirective) {
        if (!this.state.lexer) {
            this.state.lexer = {
                start: '',
                states: {}
            };
        }
        this.state.lexer.start = directive.lexer.start || this.state.lexer.start || (directive.lexer.states.length ? directive.lexer.states[0].name : '');
        for (const state of directive.lexer.states) {
            this.mergeLexerState(state);
        }
    }

    private mergeLexerState(state: LexerStateDefinition) {
        this.state.lexer.states[state.name] = this.state.lexer.states[state.name] || { name: state.name, rules: [] }
        const target = this.state.lexer.states[state.name];
        target.default = typeof state.default == 'string' ? state.default : target.default;
        target.unmatched = typeof state.unmatched == 'string' ? state.unmatched : target.unmatched;
        target.rules.push(...state.rules);
    }

    private importBuiltIn(name: string) {
        name = name.toLowerCase();
        if (!this.context.alreadycompiled.has(name)) {
            this.context.alreadycompiled.add(name);
            if (!BuiltInRegistry[name])
                return;
            this.merge(BuiltInRegistry[name].state);
        }
    }

    private async importGrammar(name) {
        const resolver = this.context.resolver;
        const path = resolver.path(name);
        if (!this.context.alreadycompiled.has(path)) {
            this.context.alreadycompiled.add(path);
            await this.mergeLanguageDefinitionString(await resolver.body(path))
        }
    }

    private async mergeLanguageDefinitionString(body: string) {
        const builder = new Compiler(this.config, this.context);
        await builder.import(this.parser.run(body).results[0]);
        this.merge(builder.state);
        return builder.state;
    }

    private merge(state: GeneratorState) {
        Object.assign(this.state.grammar.rules, state.grammar.rules);
        this.state.grammar.start = state.grammar.start || this.state.grammar.start;

        if (state.lexer) {
            if (this.state.lexer) {
                Object.assign(this.state.lexer.states, state.lexer.states);
            } else {
                this.state.lexer = state.lexer;
            }
            this.state.lexer.start = state.lexer.start || this.state.lexer.start;
        }
        this.state.head.push(...state.head);
        this.state.body.push(...state.body);
        Object.assign(this.state.config, state.config);
    }

    private uuid(name: string) {
        this.state.grammar.names[name] = (this.state.grammar.names[name] || 0) + 1;
        return name + 'x' + this.state.grammar.names[name];
    }

    private buildRules(name: string, expressions: GrammarBuilderExpression[], rule?: GrammarBuilderRule) {
        for (let i = 0; i < expressions.length; i++) {
            const r = this.buildRule(name, expressions[i], rule);
            this.state.grammar.rules[r.name] = this.state.grammar.rules[r.name] || [];
            this.state.grammar.rules[r.name].push(r);
        }
    }

    private buildRule(name: string, expression: GrammarBuilderExpression, rule?: GrammarBuilderRule): GeneratorGrammarRule {
        const symbols: GeneratorGrammarSymbol[] = [];
        for (let i = 0; i < expression.symbols.length; i++) {
            const symbol = this.buildSymbol(name, expression.symbols[i]);
            if (symbol)
                symbols.push(symbol);
        }
        return { name, symbols, postprocess: this.config.noscript ? null : expression.postprocess || rule?.postprocess };
    }

    private buildSymbol(name: string, symbol: GrammarBuilderSymbol): GeneratorGrammarSymbol {
        if ('repeat' in symbol) {
            return this.buildRepeatRules(name, symbol);
        }
        if ('rule' in symbol) {
            return symbol;
        }
        if ('regex' in symbol) {
            return symbol;
        }
        if ('token' in symbol) {
            return symbol;
        }
        if ('literal' in symbol) {
            if (!symbol.literal.length) {
                return null;
            }
            if (symbol.literal.length === 1 || this.state.lexer) {
                return symbol;
            }
            return this.buildCharacterRules(name, symbol);
        }
        if ('subexpression' in symbol) {
            return this.buildSubExpressionRules(name, symbol);
        }
    }

    private buildCharacterRules(name: string, symbol: GrammarTypeLiteral) {
        const id = this.uuid(name + "$STR");
        this.buildRules(id, [
            {
                symbols: symbol.literal
                    .split("")
                    .map((literal) => {
                        if (symbol.insensitive && literal.toLowerCase() != literal.toUpperCase())
                            return { regex: literal, flags: 'i' }
                        return { literal }
                    }),
                postprocess: { builtin: "join" }
            }
        ]);
        return { rule: id };
    }

    private buildSubExpressionRules(name: string, symbol: GrammarBuilderSymbolSubexpression) {
        const id = this.uuid(name + "$SUB");
        this.buildRules(id, symbol.subexpression);
        return { rule: id };
    }

    private buildRepeatRules(name: string, symbol: GrammarBuilderSymbolRepeat) {
        let id: string;
        let expr1: GrammarBuilderExpression = { symbols: [] };
        let expr2: GrammarBuilderExpression = { symbols: [] };
        if (symbol.repeat == '+') {
            id = this.uuid(name + "$RPT1N");
            expr1.symbols = [symbol.expression];
            expr2.symbols = [{ rule: id }, symbol.expression];
            expr2.postprocess = { builtin: "concat" };
        } else if (symbol.repeat == '*') {
            id = this.uuid(name + "$RPT0N");
            expr2.symbols = [{ rule: id }, symbol.expression];
            expr2.postprocess = { builtin: "concat" };
        } else if (symbol.repeat == '?') {
            id = this.uuid(name + "$RPT01");
            expr1.symbols = [symbol.expression];
            expr1.postprocess = { builtin: "first" };
            expr2.postprocess = { builtin: "null" };
        }
        this.buildRules(id, [expr1, expr2]);
        return { rule: id };
    }
}
