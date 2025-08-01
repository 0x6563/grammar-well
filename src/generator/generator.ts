import { ASTConfig, ASTDirectives, ASTGrammar, ASTGrammarProduction, ASTGrammarProductionRule, ASTGrammarSymbol, ASTGrammarSymbolGroup, ASTGrammarSymbolLiteral, ASTGrammarSymbolRepeat, ASTImport, ASTLexer, ASTLexerConfig, ASTLexerState, ASTLexerStateImportRule, ASTLexerStateMatchRule, ASTLexerStateSpan, GeneratorContext, GeneratorGrammarProductionRule, GeneratorGrammarSymbol, GeneratorOptions, GeneratorExportFormat, ImportResolver, GeneratorOutputOptions, GenerateOptions, ASTJavascriptLifecycleLiteral } from "../typings/index.js";

import { Parse } from "../parser/parse.js";
import GrammarV1 from './grammars/v1.js';
import GrammarV2 from './grammars/v2.js';

import BuiltInRegistry from "./builtin/registry.json" with {type: 'json'};
import { GeneratorState } from "./state.js";
import { ExportsRegistry } from "./stringify/exports/registry.js";
import { JavaScriptGenerator } from "./stringify/javascript.js";
import { BrowserImportResolver } from "./import-resolvers/browser.js";


export async function Generate(source: string, config?: GenerateOptions): Promise<ReturnType<Generator['output']>>;
export async function Generate(directive: ASTDirectives, config?: GenerateOptions): Promise<ReturnType<Generator['output']>>;
export async function Generate(directives: ASTDirectives[], config?: GenerateOptions): Promise<ReturnType<Generator['output']>>;
export async function Generate(source: string | ASTDirectives | (ASTDirectives[]), config: GenerateOptions = {}) {
    const builder = new Generator(config);
    await builder.import(source);
    return builder.output(config.output);
}

export const NAME_DELIMITER = '.';
export class Generator {
    private state = new GeneratorState();

    constructor(
        private config: GeneratorOptions = {},
        private context: GeneratorContext = {
            imported: new Set(),
            resolver: undefined as ImportResolver,
            state: undefined as GeneratorState
        },
        private aliasPrefix: string = ''
    ) {

        if (typeof config.resolver == 'function') {
            this.context.resolver = new config.resolver(config.basedir);
        } else if (config.resolver && typeof config.resolver.path == 'function' && typeof config.resolver.body == 'function') {
            this.context.resolver = config.resolver;
        } else {
            this.context.resolver == new BrowserImportResolver(config.basedir);
        }

        if (this.context.state?.grammar) {
            this.state.initializeGrammar();
            this.state.grammar.uuids = context.state.grammar.uuids;
        }
    }


    async import(source: string): Promise<void>
    async import(directive: ASTDirectives): Promise<void>
    async import(directives: ASTDirectives[]): Promise<void>
    async import(directives: string | ASTDirectives | (ASTDirectives[])): Promise<void>
    async import(directives: string | ASTDirectives | (ASTDirectives[])): Promise<void> {
        if (typeof directives == 'string') {
            await this.mergeGrammar(directives);
            return;
        }
        directives = Array.isArray(directives) ? directives : [directives];
        for (const directive of directives) {
            if ("lifecycle" in directive) {
                await this.processLifecycleDirective(directive);
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

    output(options: GeneratorOutputOptions) {
        const format = options?.format || 'esm';
        if (!ExportsRegistry[format]) {
            throw new Error("No such output format: " + format)
        }
        const generator = new JavaScriptGenerator(this.state, options);
        return ExportsRegistry[format](generator);
    }

    private async processImportDirective(directive: ASTImport) {
        if (directive.path) {
            await this.importGrammar(directive.import, this.aliasPrefix + (directive.alias || ''));
        } else {
            await this.importBuiltIn(directive.import, this.aliasPrefix + (directive.alias || ''));
        }
    }

    private async processLifecycleDirective(directive: ASTJavascriptLifecycleLiteral) {
        if ('js' in directive.js)
            this.state.addLifecycle(directive.lifecycle, directive.js.js);
        else if ('template' in directive.js)
            this.state.addLifecycle(directive.lifecycle, directive.js.template);
    }

    private processConfigDirective(directive: ASTConfig) {
        Object.assign(this.state.config, directive.config);
    }

    private processLexerDirective(directive: ASTLexer) {
        this.state.initializeLexer();
        if (directive.lexer.start) {
            this.state.lexer.start = this.aliasPrefix + directive.lexer.start;
        }

        if (!this.state.lexer.start && directive.lexer.states.length) {
            this.state.lexer.start = this.aliasPrefix + directive.lexer.states[0].name
        }
        this.importLexerStates(directive.lexer.states);
    }

    private importLexerStates(states: ASTLexerConfig['states']) {
        for (let state of states) {
            this.importLexerState(state.name, state.state);
        }
    }

    private importLexerState(name: string, state: ASTLexerState | ASTLexerStateSpan) {
        if ('span' in state) {
            this.state.addLexerState(this.aliasPrefix + name, { rules: [{ import: [`${name}${NAME_DELIMITER}start`] }] });
            const states = this.buildLexerSpanStates(name, state);
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
                if ('span' in rule) {
                    let i = 1;
                    while (`${this.aliasPrefix}${name}${NAME_DELIMITER}${i}` in this.state.lexer.states)
                        ++i;
                    const states = this.buildLexerSpanStates(`${name}${NAME_DELIMITER}${i}`, rule);
                    this.importLexerStates(states);
                    rules.push({ import: `${name}.${i}${NAME_DELIMITER}start` });
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

    private buildLexerSpanStates(name: string, rule: ASTLexerStateSpan): ASTLexerConfig['states'] {
        const transition = rule.config?.transition == 'set' ? 'set' : 'goto';
        const startRules: (ASTLexerStateMatchRule | ASTLexerStateImportRule)[] = [];
        const spanRules: (ASTLexerStateMatchRule | ASTLexerStateImportRule | ASTLexerStateSpan)[] = [];
        const stopRules: (ASTLexerStateMatchRule | ASTLexerStateImportRule)[] = [];
        const start = rule.span.find(v => v.name == 'start');
        const span = rule.span.find(v => v.name == 'span');
        const stop = rule.span.find(v => v.name == 'stop');

        if (span?.state?.rules)
            for (const r of span?.state?.rules) {
                spanRules.push(r);
            }

        if (stop?.state?.rules)
            for (const r of stop?.state?.rules) {
                if ('when' in r) {
                    stopRules.push({
                        when: r.when,
                        type: r.type,
                        tag: r.tag,
                        before: r.before,
                        skip: r.skip,
                        highlight: r.highlight,
                        open: r.open,
                        close: r.close,
                        embed: r.embed,
                        unembed: r.unembed,
                        set: r.skip ? undefined : r.set,
                        pop: r.skip || r.set ? undefined : 1
                    });
                }
                if ('import' in r) {
                    stopRules.push({
                        import: r.import,
                        set: r.set,
                        pop: r.set ? undefined : 1
                    })
                }
            }

        if (stopRules.length && spanRules.length)
            spanRules.push({ import: [`${name}${NAME_DELIMITER}stop`] })

        const target = spanRules.length ? 'span' : 'stop';

        for (const r of start?.state?.rules) {
            if ('when' in r) {
                startRules.push({
                    when: r.when,
                    skip: r.skip,
                    type: r.type,
                    tag: r.tag,
                    before: r.before,
                    highlight: r.highlight,
                    open: r.open,
                    close: r.close,
                    embed: r.embed,
                    unembed: r.unembed,
                    [transition]: r.stay ? undefined : `${name}${NAME_DELIMITER}${target}`
                });
            }

            if ('import' in r) {
                startRules.push({
                    import: r.import,
                    [transition]: r.stay ? undefined : `${name}${NAME_DELIMITER}${target}`
                })
            }
        }

        return [
            {
                name: `${name}${NAME_DELIMITER}start`,
                state: {
                    default: start.state.default,
                    rules: startRules
                }
            },
            {
                name: `${name}${NAME_DELIMITER}span`,
                state: {
                    default: span?.state?.default,
                    unmatched: span?.state?.unmatched,
                    rules: spanRules
                }
            },
            {
                name: `${name}${NAME_DELIMITER}stop`,
                state: {
                    default: stop?.state?.default,
                    rules: stopRules
                }
            }
        ]
    }

    private processGrammarDirective(directive: ASTGrammar) {
        this.state.initializeGrammar();
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
            await this.mergeGrammar(BuiltInRegistry[name], alias);
        }
    }

    private async importGrammar(path: string, alias?: string) {
        const resolver = this.context.resolver as ImportResolver;
        const fullPath = resolver.path(path);
        if (!this.context.imported.has(fullPath)) {
            this.context.imported.add(fullPath);
            await this.mergeGrammar(await resolver.body(fullPath), alias);
        }
    }

    private async mergeGrammar(body: string, alias: string = '') {
        const grammar = body.indexOf('// Grammar Well Version 1') == 0 ? GrammarV1 : GrammarV2;
        const generator = new Generator(this.config, { ...this.context, state: this.state }, alias);
        await generator.import(Parse(new grammar() as any, body));
        this.state.merge(generator.state);
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
            if (symbol.literal.length === 1 || this.state.lexer || this.context.state.lexer) {
                return symbol;
            }
            return this.buildCharacterRules(name, symbol);
        }
        if ('subexpression' in symbol) {
            return this.buildSubExpressionRules(name, symbol);
        }
    }

    private buildCharacterRules(name: string, symbol: ASTGrammarSymbolLiteral) {
        const id = this.state.grammarUUID(name + NAME_DELIMITER + "STR");
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
        const id = this.state.grammarUUID(name + NAME_DELIMITER + "SUB");
        this.buildRules(id, symbol.subexpression);
        return { rule: id };
    }

    private buildRepeatRules(name: string, symbol: ASTGrammarSymbolRepeat) {
        let id: string;
        const expr1: ASTGrammarProductionRule = { symbols: [] };
        const expr2: ASTGrammarProductionRule = { symbols: [] };
        if (symbol.repeat == '+') {
            id = this.state.grammarUUID(name + NAME_DELIMITER + "RPT1N");
            expr1.symbols = [symbol.expression];
            expr2.symbols = [{ rule: id }, symbol.expression];
            expr2.postprocess = { builtin: "concat" };
        } else if (symbol.repeat == '*') {
            id = this.state.grammarUUID(name + NAME_DELIMITER + "RPT0N");
            expr2.symbols = [{ rule: id }, symbol.expression];
            expr2.postprocess = { builtin: "concat" };
        } else if (symbol.repeat == '?') {
            id = this.state.grammarUUID(name + NAME_DELIMITER + "RPT01");
            expr1.symbols = [symbol.expression];
            expr1.postprocess = { builtin: "first" };
            expr2.postprocess = { builtin: "null" };
        }
        this.buildRules(id, [expr1, expr2]);
        return { rule: id };
    }
}
