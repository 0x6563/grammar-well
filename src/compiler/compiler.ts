import { CompileOptions, CompilerContext, OutputFormat, LanguageDirective, GeneratorState, ConfigDirective, Dictionary, GrammarBuilderSymbolRepeat, GrammarBuilderExpression, GrammarBuilderRule, GrammarDirective, ImportDirective, LexerDirective, GrammarBuilderSymbolSubexpression, GrammarBuilderSymbolLiteral, GrammarBuilderRuleSymbol, GrammarBuilderSymbol } from "../typings";

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
            rules: [],
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
        return name + 'x' + this.state.grammar.names[name];
    }

    private buildRules(name: string, rules: GrammarBuilderExpression[], scope: Dictionary<string>) {
        for (let i = 0; i < rules.length; i++) {
            const rule = this.buildRule(name, rules[i], scope);
            this.state.grammar.rules.push(rule);
        }
    }

    private buildRule(name: string, rule: GrammarBuilderExpression, scope: Dictionary<string>): GrammarBuilderRule {
        const symbols: GrammarBuilderRuleSymbol[] = [];
        for (let i = 0; i < rule.symbols.length; i++) {
            const symbol = this.buildSymbol(name, rule.symbols[i], scope);
            if (symbol !== null) {
                symbols.push(symbol);
            }
        }
        return { name, symbols, postprocess: this.config.noscript ? null : rule.postprocess };
    }

    private buildSymbol(name: string, symbol: GrammarBuilderSymbol, scope: Dictionary<string>): GrammarBuilderRuleSymbol {
        if ('repeat' in symbol) {
            return this.buildRepeatRules(name, symbol, scope);
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
            return this.buildCharacterRules(name, symbol, scope);
        }
        if ('subexpression' in symbol) {
            return this.buildSubExpressionRules(name, symbol, scope);
        }
        throw new Error("Unrecognized symbol: " + JSON.stringify(symbol));
    }

    private buildCharacterRules(name: string, symbol: GrammarBuilderSymbolLiteral, scope: Dictionary<string>) {
        const id = this.uuid(name + "$STR");
        this.buildRules(id, [
            {
                symbols: symbol.literal.split("").map((literal) => ({ literal })),
                postprocess: { builtin: "join" }
            }
        ], scope);
        return { rule: id };
    }

    private buildSubExpressionRules(name: string, symbol: GrammarBuilderSymbolSubexpression, scope: Dictionary<string>) {
        const id = this.uuid(name + "$SUB");
        this.buildRules(id, symbol.subexpression, scope);
        return { rule: id };
    }

    private buildRepeatRules(name: string, symbol: GrammarBuilderSymbolRepeat, scope: Dictionary<string>) {
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
        this.buildRules(id, [expr1, expr2], scope);
        return { rule: id };
    }
}
