import { CompileOptions, GrammarBuilderContext, OutputFormat, LanguageDirective, ConfigDirective, GrammarBuilderSymbolRepeat, GrammarBuilderExpression, GeneratorGrammarRule, GrammarDirective, ImportDirective, LexerDirective, GrammarBuilderSymbolSubexpression, GrammarTypeLiteral, GeneratorGrammarSymbol, GrammarBuilderSymbol, LexerStateDefinition, GrammarBuilderRule } from "../typings";

import { Parser } from "../parser/parser";
import { FileSystemResolver } from "./import-resolver";
import Language from '../grammars/gwell';

import { ESMOutput, JavascriptOutput } from "./outputs/javascript";
import { TypescriptFormat } from "./outputs/typescript";
import { JSONFormatter } from "./outputs/json";

import * as number from '../grammars/number.json';
import * as string from '../grammars/string.json';
import * as whitespace from '../grammars/whitespace.json';
import { Generator } from "./generator";

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
    const builder = new GrammarBuilder(config);
    await builder.import(rules as any);
    return builder.export(config.format);
}

export class GrammarBuilder {
    private parser = new Parser(Language());
    private context: GrammarBuilderContext;

    generator = new Generator();

    constructor(private config: CompileOptions = {}, context?: GrammarBuilderContext) {
        this.context = context || {
            alreadyCompiled: new Set(),
            resolver: config.resolverInstance ? config.resolverInstance : config.resolver ? new config.resolver(config.basedir) : new FileSystemResolver(config.basedir),
            uuids: {}
        }
        this.generator.state.grammar.uuids = this.context.uuids;
    }

    export<T extends OutputFormat = '_default'>(format: T, name: string = 'GWLanguage'): ReturnType<typeof OutputFormats[T]> {
        const grammar = this.generator.state;
        const output = format || grammar.config.preprocessor || '_default';
        if (OutputFormats[output]) {
            return OutputFormats[output](this.generator, name);
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
                this.generator.state.head.push(directive.head.js);
            } else if ("body" in directive) {
                this.generator.state.body.push(directive.body.js);
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
        Object.assign(this.generator.state.config, directive.config);
    }

    private processGrammarDirective(directive: GrammarDirective) {
        if (directive.grammar.config) {
            this.generator.state.grammar.start = directive.grammar.config.start || this.generator.state.grammar.start;
        }

        for (const rule of directive.grammar.rules) {
            this.buildRules(rule.name, rule.expressions, rule);
            this.generator.state.grammar.start = this.generator.state.grammar.start || rule.name;
        }
    }

    private processLexerDirective(directive: LexerDirective) {
        if (!this.generator.state.lexer) {
            this.generator.state.lexer = {
                start: '',
                states: {}
            };
        }
        this.generator.state.lexer.start = directive.lexer.start || this.generator.state.lexer.start || (directive.lexer.states.length ? directive.lexer.states[0].name : '');
        for (const state of directive.lexer.states) {
            this.generator.addLexerState(state);
        }
    }

    private importBuiltIn(name: string) {
        name = name.toLowerCase();
        if (!this.context.alreadyCompiled.has(name)) {
            this.context.alreadyCompiled.add(name);
            if (!BuiltInRegistry[name])
                return;
            this.generator.merge(BuiltInRegistry[name].state);
        }
    }

    private async importGrammar(name) {
        const resolver = this.context.resolver;
        const path = resolver.path(name);
        if (!this.context.alreadyCompiled.has(path)) {
            this.context.alreadyCompiled.add(path);
            await this.mergeLanguageDefinitionString(await resolver.body(path))
        }
    }

    private async mergeLanguageDefinitionString(body: string) {
        const builder = new GrammarBuilder(this.config, this.context);
        await builder.import(this.parser.run(body).results[0]);
        this.generator.merge(builder.generator.state);
        return;
    }

    private buildRules(name: string, expressions: GrammarBuilderExpression[], rule?: GrammarBuilderRule) {
        for (const expression of expressions) {
            this.generator.addGrammarRule(this.buildRule(name, expression, rule));
        }
    }

    private buildRule(name: string, expression: GrammarBuilderExpression, rule?: GrammarBuilderRule): GeneratorGrammarRule {
        const symbols: GeneratorGrammarSymbol[] = [];
        for (let i = 0; i < expression.symbols.length; i++) {
            const symbol = this.buildSymbol(name, expression.symbols[i]);
            if (symbol)
                symbols.push(symbol);
        }
        return { name, symbols, postprocess: expression.postprocess || rule?.postprocess };
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
            if (symbol.literal.length === 1 || this.generator.state.lexer) {
                return symbol;
            }
            return this.buildCharacterRules(name, symbol);
        }
        if ('subexpression' in symbol) {
            return this.buildSubExpressionRules(name, symbol);
        }
    }

    private buildCharacterRules(name: string, symbol: GrammarTypeLiteral) {
        const id = this.generator.grammarUUID(name + "$STR");
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
        const id = this.generator.grammarUUID(name + "$SUB");
        this.buildRules(id, symbol.subexpression);
        return { rule: id };
    }

    private buildRepeatRules(name: string, symbol: GrammarBuilderSymbolRepeat) {
        let id: string;
        const expr1: GrammarBuilderExpression = { symbols: [] };
        const expr2: GrammarBuilderExpression = { symbols: [] };
        if (symbol.repeat == '+') {
            id = this.generator.grammarUUID(name + "$RPT1N");
            expr1.symbols = [symbol.expression];
            expr2.symbols = [{ rule: id }, symbol.expression];
            expr2.postprocess = { builtin: "concat" };
        } else if (symbol.repeat == '*') {
            id = this.generator.grammarUUID(name + "$RPT0N");
            expr2.symbols = [{ rule: id }, symbol.expression];
            expr2.postprocess = { builtin: "concat" };
        } else if (symbol.repeat == '?') {
            id = this.generator.grammarUUID(name + "$RPT01");
            expr1.symbols = [symbol.expression];
            expr1.postprocess = { builtin: "first" };
            expr2.postprocess = { builtin: "null" };
        }
        this.buildRules(id, [expr1, expr2]);
        return { rule: id };
    }
}
