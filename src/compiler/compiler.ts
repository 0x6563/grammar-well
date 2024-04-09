import { CompileOptions, GrammarBuilderContext, TemplateFormat, LanguageDirective, ConfigDirective, GrammarBuilderSymbolRepeat, GrammarBuilderExpression, GeneratorGrammarRule, GrammarDirective, ImportDirective, LexerDirective, GrammarBuilderSymbolSubexpression, GrammarTypeLiteral, GeneratorGrammarSymbol, GrammarBuilderSymbol, GrammarBuilderRule } from "../typings";

import { Parser } from "../parser/parser";
import { FileSystemResolver } from "./import-resolver";
import Language from './gwell';

import { ESMOutput, JavascriptOutput } from "./outputs/javascript";
import { TypescriptFormat } from "./outputs/typescript";
import { JSONFormatter } from "./outputs/json";

import { Generator } from "./generator/generator";
import * as BuiltInRegistry from "./builtin.json"

const TemplateFormats = {
    _default: JavascriptOutput,
    object: (grammar, exportName) => ({ grammar, exportName }),
    json: JSONFormatter,
    js: JavascriptOutput,
    javascript: JavascriptOutput,
    module: ESMOutput,
    esmodule: ESMOutput,
    esm: ESMOutput,
    ts: TypescriptFormat,
    typescript: TypescriptFormat
}

export async function Compile(rules: string | LanguageDirective | (LanguageDirective[]), config: CompileOptions = {}) {
    const builder = new GrammarBuilder(config);
    await builder.import(rules as any);
    Object.assign(builder.generator.state.config, config.overrides);
    return builder.export(config.template);
}

export class GrammarBuilder {
    private parser = new Parser(Language() as any);
    private context: GrammarBuilderContext;

    generator = new Generator();

    constructor(private config: CompileOptions = {}, context?: GrammarBuilderContext, private alias: string = '') {
        this.context = context || {
            alreadyCompiled: new Set(),
            resolver: config.resolverInstance ? config.resolverInstance : config.resolver ? new config.resolver(config.basedir) : new FileSystemResolver(config.basedir),
            uuids: {}
        }
        this.generator.state.grammar.uuids = this.context.uuids;
    }

    export<T extends TemplateFormat = '_default'>(format: T, name: string = 'GWLanguage'): ReturnType<typeof TemplateFormats[T]> {
        const grammar = this.generator.state;
        const output = format || grammar.config.preprocessor || '_default';
        if (TemplateFormats[output]) {
            return TemplateFormats[output](this.generator, name);
        }
        throw new Error("No such preprocessor: " + output)
    }

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
            await this.importGrammar(directive.import, directive.alias);
        } else {
            this.importBuiltIn(directive.import);
        }
    }

    private processConfigDirective(directive: ConfigDirective) {
        Object.assign(this.generator.state.config, directive.config);
    }

    private processGrammarDirective(directive: GrammarDirective) {
        if (directive.grammar.config) {
            if (directive.grammar.config.start) {
                this.generator.state.grammar.start = this.alias + directive.grammar.config.start;
            }

            Object.assign(this.generator.state.grammar.config, directive.grammar.config);
            // this.generator.state.grammar.postprocessDefault =  directive.grammar.config.postprocessDefault || this.generator.state.grammar.postprocessDefault;
            // this.generator.state.grammar.postprocessOverride =  directive.grammar.config.postprocessOverride || this.generator.state.grammar.postprocessOverride;
        }

        if (!this.generator.state.grammar.start && directive.grammar.rules.length) {
            this.generator.state.grammar.start = this.alias + directive.grammar.rules[0].name;
        }

        for (const rule of directive.grammar.rules) {
            rule.name = this.alias + rule.name;
            this.buildRules(rule.name, rule.expressions, rule);
        }
    }

    private processLexerDirective(directive: LexerDirective) {
        if (!this.generator.state.lexer) {
            this.generator.state.lexer = {
                start: '',
                states: {}
            };
        }
        if (directive.lexer.start) {
            this.generator.state.lexer.start = this.alias + directive.lexer.start;
        }

        if (!this.generator.state.lexer.start && directive.lexer.states.length) {
            this.generator.state.lexer.start = this.alias + directive.lexer.states[0].name
        }

        for (const state of directive.lexer.states) {
            state.name = this.alias + state.name;
            if (this.alias) {
                state.rules.forEach(v => {
                    if ('import' in v) {
                        v.import = v.import.map(v2 => this.alias + v2);
                    }
                    if ('set' in v) {
                        v.set = this.alias + v.set;
                    }
                    if ('goto' in v) {
                        v.goto = this.alias + v.goto;
                    }
                })
            }
            this.generator.addLexerState(state);
        }
    }

    private async importBuiltIn(name: string, alias?: string) {
        name = name.toLowerCase();
        if (!this.context.alreadyCompiled.has(name)) {
            this.context.alreadyCompiled.add(name);
            if (!BuiltInRegistry[name])
                return;
            await this.mergeLanguageDefinitionString(BuiltInRegistry[name], alias);
        }
    }

    private async importGrammar(path: string, alias?: string) {
        const resolver = this.context.resolver;
        const fullPath = resolver.path(path);
        if (!this.context.alreadyCompiled.has(fullPath)) {
            this.context.alreadyCompiled.add(fullPath);
            await this.mergeLanguageDefinitionString(await resolver.body(fullPath), alias);
        }
    }

    private async mergeLanguageDefinitionString(body: string, alias: string = '') {
        const builder = new GrammarBuilder(this.config, this.context, alias);
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
            return { ...symbol, rule: this.alias + symbol.rule };
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
