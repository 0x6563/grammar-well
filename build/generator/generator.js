import { Parse } from "../parser/parse.js";
import GrammarV1 from './grammars/v1.js';
import GrammarV2 from './grammars/v2.js';
import BuiltInRegistry from "./builtin/registry.json" with { type: 'json' };
import { GeneratorState } from "./state.js";
import { ExportsRegistry } from "./stringify/exports/registry.js";
import { JavaScriptGenerator } from "./stringify/javascript.js";
import { BrowserImportResolver } from "./import-resolvers/browser.js";
export async function Generate(source, config = {}) {
    const builder = new Generator(config);
    await builder.import(source);
    return builder.format(config.export);
}
export class Generator {
    config;
    context;
    aliasPrefix;
    state = new GeneratorState();
    constructor(config = {}, context = {
        imported: new Set(),
        resolver: undefined,
        state: undefined
    }, aliasPrefix = '') {
        this.config = config;
        this.context = context;
        this.aliasPrefix = aliasPrefix;
        if (typeof config.resolver == 'function') {
            this.context.resolver = new config.resolver(config.basedir);
        }
        else if (config.resolver && typeof config.resolver.path == 'function' && typeof config.resolver.body == 'function') {
            this.context.resolver = config.resolver;
        }
        else {
            this.context.resolver == new BrowserImportResolver(config.basedir);
        }
        if (this.context.state?.grammar) {
            this.state.initializeGrammar();
            this.state.grammar.uuids = context.state.grammar.uuids;
        }
    }
    async import(directives) {
        if (typeof directives == 'string') {
            await this.mergeGrammar(directives);
            return;
        }
        directives = Array.isArray(directives) ? directives : [directives];
        for (const directive of directives) {
            if ("lifecycle" in directive) {
                await this.processLifecycleDirective(directive);
            }
            else if ("import" in directive) {
                await this.processImportDirective(directive);
            }
            else if ("config" in directive) {
                this.processConfigDirective(directive);
            }
            else if ("grammar" in directive) {
                this.processGrammarDirective(directive);
            }
            else if ("lexer" in directive) {
                this.processLexerDirective(directive);
            }
        }
    }
    format(options) {
        const format = options?.format || 'esm';
        if (!ExportsRegistry[format]) {
            throw new Error("No such output format: " + format);
        }
        const generator = new JavaScriptGenerator(this.state, options);
        return ExportsRegistry[format](generator);
    }
    async processImportDirective(directive) {
        if (directive.path) {
            await this.importGrammar(directive.import, this.aliasPrefix + (directive.alias || ''));
        }
        else {
            await this.importBuiltIn(directive.import, this.aliasPrefix + (directive.alias || ''));
        }
    }
    async processLifecycleDirective(directive) {
        this.state.addLifecycle(directive.lifecycle, directive.js.js);
    }
    processConfigDirective(directive) {
        Object.assign(this.state.config, directive.config);
    }
    processLexerDirective(directive) {
        this.state.initializeLexer();
        if (directive.lexer.start) {
            this.state.lexer.start = this.aliasPrefix + directive.lexer.start;
        }
        if (!this.state.lexer.start && directive.lexer.states.length) {
            this.state.lexer.start = this.aliasPrefix + directive.lexer.states[0].name;
        }
        this.importLexerStates(directive.lexer.states);
    }
    importLexerStates(states) {
        for (let state of states) {
            this.importLexerState(state.name, state.state);
        }
    }
    importLexerState(name, state) {
        if ('sections' in state) {
            this.state.addLexerState(this.aliasPrefix + name, { rules: [{ import: [`${name}$opener`] }] });
            const states = this.buildLexerStructuredStates(name, state);
            this.importLexerStates(states);
        }
        else {
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
                    rules.push({ import: `${name}$${i}$opener` });
                    continue;
                }
                else {
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
    buildLexerStructuredStates(name, rule) {
        const openRules = [];
        const bodyRules = [];
        const closeRules = [];
        const open = rule.sections.find(v => v.name == 'opener');
        const body = rule.sections.find(v => v.name == 'body');
        const close = rule.sections.find(v => v.name == 'closer');
        if (body?.state?.rules)
            for (const r of body?.state?.rules) {
                bodyRules.push(r);
            }
        if (close?.state?.rules)
            for (const r of close?.state?.rules) {
                if ('when' in r) {
                    closeRules.push({
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
                    closeRules.push({
                        import: r.import,
                        set: r.set,
                        pop: r.set ? undefined : 1
                    });
                }
            }
        if (closeRules.length && bodyRules.length)
            bodyRules.push({ import: [`${name}$closer`] });
        const target = bodyRules.length ? 'body' : 'closer';
        for (const r of open?.state?.rules) {
            if ('when' in r) {
                openRules.push({
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
                    goto: r.stay ? undefined : `${name}$${target}`
                });
            }
            if ('import' in r) {
                openRules.push({
                    import: r.import,
                    goto: r.stay ? undefined : `${name}$${target}`
                });
            }
        }
        return [
            {
                name: `${name}$opener`,
                state: {
                    default: open.state.default,
                    rules: openRules
                }
            },
            {
                name: `${name}$body`,
                state: {
                    default: body?.state?.default,
                    unmatched: body?.state?.unmatched,
                    rules: bodyRules
                }
            },
            {
                name: `${name}$closer`,
                state: {
                    default: close?.state?.default,
                    rules: closeRules
                }
            }
        ];
    }
    processGrammarDirective(directive) {
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
    async importBuiltIn(name, alias) {
        name = name.toLowerCase();
        if (!this.context.imported.has(name)) {
            this.context.imported.add(name);
            if (!BuiltInRegistry[name])
                return;
            await this.mergeGrammar(BuiltInRegistry[name], alias);
        }
    }
    async importGrammar(path, alias) {
        const resolver = this.context.resolver;
        const fullPath = resolver.path(path);
        if (!this.context.imported.has(fullPath)) {
            this.context.imported.add(fullPath);
            await this.mergeGrammar(await resolver.body(fullPath), alias);
        }
    }
    async mergeGrammar(body, alias = '') {
        const grammar = body.indexOf('// Grammar Well Version 1') == 0 ? GrammarV1 : GrammarV2;
        const generator = new Generator(this.config, { ...this.context, state: this.state }, alias);
        await generator.import(Parse(new grammar(), body));
        this.state.merge(generator.state);
        return;
    }
    buildRules(name, expressions, rule) {
        for (const expression of expressions) {
            this.state.addGrammarRule(this.buildRule(name, expression, rule));
        }
    }
    buildRule(name, expression, rule) {
        const symbols = [];
        for (let i = 0; i < expression.symbols.length; i++) {
            const symbol = this.buildSymbol(name, expression.symbols[i]);
            if (symbol)
                symbols.push(symbol);
        }
        return { name, symbols, postprocess: expression.postprocess || rule?.postprocess };
    }
    buildSymbol(name, symbol) {
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
    buildCharacterRules(name, symbol) {
        const id = this.state.grammarUUID(name + "$STR");
        this.buildRules(id, [
            {
                symbols: symbol.literal
                    .split("")
                    .map((literal) => {
                    if (symbol.insensitive && literal.toLowerCase() != literal.toUpperCase())
                        return { regex: literal, flags: 'i' };
                    return { literal };
                }),
                postprocess: { builtin: "join" }
            }
        ]);
        return { rule: id };
    }
    buildSubExpressionRules(name, symbol) {
        const id = this.state.grammarUUID(name + "$SUB");
        this.buildRules(id, symbol.subexpression);
        return { rule: id };
    }
    buildRepeatRules(name, symbol) {
        let id;
        const expr1 = { symbols: [] };
        const expr2 = { symbols: [] };
        if (symbol.repeat == '+') {
            id = this.state.grammarUUID(name + "$RPT1N");
            expr1.symbols = [symbol.expression];
            expr2.symbols = [{ rule: id }, symbol.expression];
            expr2.postprocess = { builtin: "concat" };
        }
        else if (symbol.repeat == '*') {
            id = this.state.grammarUUID(name + "$RPT0N");
            expr2.symbols = [{ rule: id }, symbol.expression];
            expr2.postprocess = { builtin: "concat" };
        }
        else if (symbol.repeat == '?') {
            id = this.state.grammarUUID(name + "$RPT01");
            expr1.symbols = [symbol.expression];
            expr1.postprocess = { builtin: "first" };
            expr2.postprocess = { builtin: "null" };
        }
        this.buildRules(id, [expr1, expr2]);
        return { rule: id };
    }
}
//# sourceMappingURL=generator.js.map