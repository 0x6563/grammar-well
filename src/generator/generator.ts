import { ASTConfig, ASTDirectives, ASTGrammar, ASTGrammarProduction, ASTGrammarProductionRule, ASTGrammarSymbol, ASTGrammarSymbolGroup, ASTGrammarSymbolLiteral, ASTGrammarSymbolRepeat, ASTImport, ASTLexer, GeneratorContext, GeneratorGrammarProductionRule, GeneratorGrammarSymbol, GeneratorOptions, ImportResolver, GeneratorTemplateFormat, ASTLexerAnonymousStateStructured, ASTLexerStateStructured, ASTLexerState, ASTLexerStateMatchRule, ASTLexerStateImportRule } from "../typings";

import { Parser } from "../parser/parser";
import Language from './grammars/v2';
import { DefaultImportResolver } from "./import-resolvers/default";

import * as BuiltInRegistry from "./builtin/registry.json";
import { GeneratorState } from "./state";
import { ExportsRegistry } from "./stringify/exports/registry";
import { JavaScriptGenerator } from "./stringify/javascript";

export async function Generate(rules: string | ASTDirectives | (ASTDirectives[]), config: GeneratorOptions = {}) {
    const builder = new Generator(config);
    await builder.import(rules as any);
    Object.assign(builder.state.config, config.overrides);
    return builder.export(config.template);
}

export class Generator {
    private parser = new Parser(Language() as any);
    private context: GeneratorContext;

    state = new GeneratorState();
    generator = new JavaScriptGenerator(this.state);

    constructor(private config: GeneratorOptions = {}, context?: GeneratorContext, private aliasPrefix: string = '') {
        this.context = context || {
            imported: new Set(),
            resolver: undefined as ImportResolver,
            uuids: {}
        }

        if (typeof config.resolver == 'function') {
            this.context.resolver = new config.resolver(config.basedir);
        } else if (config.resolver && typeof config.resolver.path == 'function' && typeof config.resolver.body == 'function') {
            this.context.resolver = config.resolver;
        } else {
            this.context.resolver == new DefaultImportResolver(config.basedir);
        }

        this.state.grammar.uuids = this.context.uuids;
    }

    async import(source: string): Promise<void>
    async import(directive: ASTDirectives): Promise<void>
    async import(directives: ASTDirectives[]): Promise<void>
    async import(directives: string | ASTDirectives | (ASTDirectives[])): Promise<void> {
        if (typeof directives == 'string') {
            await this.mergeLanguageDefinitionString(directives);
            return;
        }
        directives = Array.isArray(directives) ? directives : [directives];
        for (const directive of directives) {
            if ("head" in directive) {
                this.state.head.push(directive.head.js);
            } else if ("body" in directive) {
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

    export<T extends GeneratorTemplateFormat = '_default'>(format, name: string = 'GWLanguage'): ReturnType<typeof ExportsRegistry[T]> {
        const grammar = this.state;
        const output = format || grammar.config.preprocessor || '_default';
        if (ExportsRegistry[output]) {
            return ExportsRegistry[output](this.generator, name);
        }
        throw new Error("No such preprocessor: " + output)
    }

    private async processImportDirective(directive: ASTImport) {
        if (directive.path) {
            await this.importGrammar(directive.import, this.aliasPrefix + (directive.alias || ''));
        } else {
            await this.importBuiltIn(directive.import, this.aliasPrefix + (directive.alias || ''));
        }
    }

    private processConfigDirective(directive: ASTConfig) {
        Object.assign(this.state.config, directive.config);
    }

    private processLexerDirective(directive: ASTLexer) {
        if (!this.state.lexer) {
            this.state.lexer = {
                start: '',
                states: {}
            };
        }
        if (directive.lexer.start) {
            this.state.lexer.start = this.aliasPrefix + directive.lexer.start;
        }

        if (!this.state.lexer.start && directive.lexer.states.length) {
            // this.state.lexer.start = this.alias + directive.lexer.states[0].name
        }
        this.importLexerStates(directive.lexer.states);
    }

    private importLexerStates(states: { [key: string]: ASTLexerState | ASTLexerStateStructured }) {
        for (let name in states) {
            const state = states[name];
            this.importLexerState(name, state);
        }
    }
    private importLexerState(name: string, state: ASTLexerState | ASTLexerStateStructured) {
        if ('sections' in state) {
            const states = this.buildLexerStructuredStates(name, state);
            this.state.addLexerState(this.aliasPrefix + name, { rules: [{ import: [`${name}$open`] }] });
            this.importLexerStates(states);
        } else {
            if (state.default && state.unmatched) {
                state.unmatched.type = typeof state.unmatched.type != 'undefined' ? state.unmatched.type : state.default?.type;
                state.unmatched.tag = typeof state.unmatched.tag != 'undefined' ? state.unmatched.tag : state.default?.tag;
                state.unmatched.open = typeof state.unmatched.open != 'undefined' ? state.unmatched.open : state.default?.open;
                state.unmatched.close = typeof state.unmatched.close != 'undefined' ? state.unmatched.close : state.default?.close;
                state.unmatched.highlight = typeof state.unmatched.highlight != 'undefined' ? state.unmatched.highlight : state.default?.highlight;
            }
            const rules = [];
            for (const rule of state.rules) {
                if ('sections' in rule) {
                    let i = 1;
                    while (`${this.aliasPrefix}${name}$${i}` in this.state.lexer.states)
                        ++i;
                    const states = this.buildLexerStructuredStates(`${name}$${i}`, rule);
                    this.importLexerStates(states);
                    rules.push({ import: `${name}$${i}$open` });
                    continue;
                } else {
                    if (this.aliasPrefix) {
                        if ('import' in rule) {
                            rule.import = rule.import.map(v2 => this.aliasPrefix + v2);
                        }
                        if ('set' in rule) {
                            rule.set = this.aliasPrefix + rule.set;
                        }
                        if ('goto' in rule) {
                            rule.goto = this.aliasPrefix + rule.goto;
                        }
                    }
                    if ('when' in rule && state.default) {
                        rule.type = typeof rule.type != 'undefined' ? rule.type : state.default?.type;
                        rule.tag = typeof rule.tag != 'undefined' ? rule.tag : state.default?.tag;
                        rule.open = typeof rule.open != 'undefined' ? rule.open : state.default?.open;
                        rule.close = typeof rule.close != 'undefined' ? rule.close : state.default?.close;
                        rule.highlight = typeof rule.highlight != 'undefined' ? rule.highlight : state.default?.highlight;
                    }
                    rules.push(rule);
                }
            }
            this.state.addLexerState(this.aliasPrefix + name, { ...state, rules });
        }
    }

    private buildLexerStructuredStates(name: string, sections: ASTLexerStateStructured) {
        const open: (ASTLexerStateMatchRule | ASTLexerStateImportRule)[] = [];
        const body: (ASTLexerStateMatchRule | ASTLexerStateImportRule | ASTLexerStateStructured)[] = [];
        const close: (ASTLexerStateMatchRule | ASTLexerStateImportRule)[] = [];

        for (const r of sections.sections?.open?.rules) {
            if ('when' in r) {
                open.push({
                    when: r.when,
                    type: r.type,
                    tag: r.tag,
                    before: r.before,
                    highlight: r.highlight,
                    open: r.open,
                    close: r.close,
                    embed: r.embed,
                    unembed: r.unembed,
                    goto: `${name}$body`
                });
            }

            if ('import' in r) {
                open.push({
                    import: r.import,
                    goto: `${name}$body`
                })
            }
        }

        for (const r of sections.sections?.body?.rules) {
            body.push(r);
        }
        body.push({ import: [`${name}$close`] })

        for (const r of sections.sections?.close?.rules) {
            if ('when' in r) {
                close.push({
                    when: r.when,
                    type: r.type,
                    tag: r.tag,
                    before: r.before,
                    highlight: r.highlight,
                    open: r.open,
                    close: r.close,
                    embed: r.embed,
                    unembed: r.unembed,
                    set: r.set,
                    pop: r.set ? undefined : 1
                });
            }
            if ('import' in r) {
                close.push({
                    import: r.import,
                    set: r.set,
                    pop: r.set ? undefined : 1
                })
            }
        }

        return {
            [`${name}$open`]: {
                default: sections.sections.open.default,
                rules: open
            },
            [`${name}$body`]: {
                default: sections.sections.body.default,
                unmatched: sections.sections.body.unmatched,
                rules: body
            },
            [`${name}$close`]: {
                default: sections.sections.close.default,
                rules: close
            }
        }
    }

    private processGrammarDirective(directive: ASTGrammar) {
        if (directive.grammar.config) {
            if (directive.grammar.config.start) {
                this.state.grammar.start = this.aliasPrefix + directive.grammar.config.start;
            }

            Object.assign(this.state.grammar.config, directive.grammar.config);
        }

        if (!this.state.grammar.start && directive.grammar.rules.length) {
            this.state.grammar.start = this.aliasPrefix + directive.grammar.rules[0].name;
        }

        for (const rule of directive.grammar.rules) {
            rule.name = this.aliasPrefix + rule.name;
            this.buildRules(rule.name, rule.expressions, rule);
        }
    }

    private async importBuiltIn(name: string, alias?: string) {
        name = name.toLowerCase();
        if (!this.context.imported.has(name)) {
            this.context.imported.add(name);
            if (!BuiltInRegistry[name])
                return;
            await this.mergeLanguageDefinitionString(BuiltInRegistry[name], alias);
        }
    }

    private async importGrammar(path: string, alias?: string) {
        const resolver = this.context.resolver as ImportResolver;
        const fullPath = resolver.path(path);
        if (!this.context.imported.has(fullPath)) {
            this.context.imported.add(fullPath);
            await this.mergeLanguageDefinitionString(await resolver.body(fullPath), alias);
        }
    }

    private async mergeLanguageDefinitionString(body: string, alias: string = '') {
        const builder = new Generator(this.config, this.context, alias);
        await builder.import(this.parser.run(body).results[0]);
        this.state.merge(builder.state);
        return;
    }

    private buildRules(name: string, expressions: ASTGrammarProductionRule[], rule?: ASTGrammarProduction) {
        for (const expression of expressions) {
            this.state.addGrammarRule(this.buildRule(name, expression, rule));
        }
    }

    private buildRule(name: string, expression: ASTGrammarProductionRule, rule?: ASTGrammarProduction): GeneratorGrammarProductionRule {
        const symbols: GeneratorGrammarSymbol[] = [];
        for (let i = 0; i < expression.symbols.length; i++) {
            const symbol = this.buildSymbol(name, expression.symbols[i]);
            if (symbol)
                symbols.push(symbol);
        }
        return { name, symbols, postprocess: expression.postprocess || rule?.postprocess };
    }

    private buildSymbol(name: string, symbol: ASTGrammarSymbol): GeneratorGrammarSymbol {
        if ('repeat' in symbol) {
            return this.buildRepeatRules(name, symbol);
        }
        if ('rule' in symbol) {
            return { ...symbol, rule: this.aliasPrefix + symbol.rule };
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

    private buildCharacterRules(name: string, symbol: ASTGrammarSymbolLiteral) {
        const id = this.state.grammarUUID(name + "$STR");
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

    private buildSubExpressionRules(name: string, symbol: ASTGrammarSymbolGroup) {
        const id = this.state.grammarUUID(name + "$SUB");
        this.buildRules(id, symbol.subexpression);
        return { rule: id };
    }

    private buildRepeatRules(name: string, symbol: ASTGrammarSymbolRepeat) {
        let id: string;
        const expr1: ASTGrammarProductionRule = { symbols: [] };
        const expr2: ASTGrammarProductionRule = { symbols: [] };
        if (symbol.repeat == '+') {
            id = this.state.grammarUUID(name + "$RPT1N");
            expr1.symbols = [symbol.expression];
            expr2.symbols = [{ rule: id }, symbol.expression];
            expr2.postprocess = { builtin: "concat" };
        } else if (symbol.repeat == '*') {
            id = this.state.grammarUUID(name + "$RPT0N");
            expr2.symbols = [{ rule: id }, symbol.expression];
            expr2.postprocess = { builtin: "concat" };
        } else if (symbol.repeat == '?') {
            id = this.state.grammarUUID(name + "$RPT01");
            expr1.symbols = [symbol.expression];
            expr1.postprocess = { builtin: "first" };
            expr2.postprocess = { builtin: "null" };
        }
        this.buildRules(id, [expr1, expr2]);
        return { rule: id };
    }
}
