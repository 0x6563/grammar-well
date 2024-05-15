"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generator = exports.Generate = void 0;
const parser_1 = require("../parser/parser");
const import_resolver_1 = require("./import-resolver");
const gwell_1 = require("./gwell");
const javascript_1 = require("./stringify/javascript");
const BuiltInRegistry = require("./builtin/registry.json");
const registry_1 = require("./stringify/exports/registry");
const state_1 = require("./state");
async function Generate(rules, config = {}) {
    const builder = new Generator(config);
    await builder.import(rules);
    Object.assign(builder.state.config, config.overrides);
    return builder.export(config.template);
}
exports.Generate = Generate;
class Generator {
    config;
    alias;
    parser = new parser_1.Parser((0, gwell_1.default)());
    context;
    state = new state_1.GeneratorState();
    generator = new javascript_1.JavaScriptGenerator(this.state);
    constructor(config = {}, context, alias = '') {
        this.config = config;
        this.alias = alias;
        this.context = context || {
            imported: new Set(),
            resolver: undefined,
            uuids: {}
        };
        if (typeof config.resolver == 'function') {
            this.context.resolver = new config.resolver(config.basedir);
        }
        else if (config.resolver && typeof config.resolver.path == 'function' && typeof config.resolver.body == 'function') {
            this.context.resolver = config.resolver;
        }
        else {
            this.context.resolver == new import_resolver_1.FileSystemResolver(config.basedir);
        }
        this.state.grammar.uuids = this.context.uuids;
    }
    async import(directives) {
        if (typeof directives == 'string') {
            await this.mergeLanguageDefinitionString(directives);
            return;
        }
        directives = Array.isArray(directives) ? directives : [directives];
        for (const directive of directives) {
            if ("head" in directive) {
                this.state.head.push(directive.head.js);
            }
            else if ("body" in directive) {
                this.state.body.push(directive.body.js);
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
    export(format, name = 'GWLanguage') {
        const grammar = this.state;
        const output = format || grammar.config.preprocessor || '_default';
        if (registry_1.ExportsRegistry[output]) {
            return registry_1.ExportsRegistry[output](this.generator, name);
        }
        throw new Error("No such preprocessor: " + output);
    }
    async processImportDirective(directive) {
        if (directive.path) {
            await this.importGrammar(directive.import, this.alias + (directive.alias || ''));
        }
        else {
            await this.importBuiltIn(directive.import, this.alias + (directive.alias || ''));
        }
    }
    processConfigDirective(directive) {
        Object.assign(this.state.config, directive.config);
    }
    processLexerDirective(directive) {
        if (!this.state.lexer) {
            this.state.lexer = {
                start: '',
                states: {}
            };
        }
        if (directive.lexer.start) {
            this.state.lexer.start = this.alias + directive.lexer.start;
        }
        if (!this.state.lexer.start && directive.lexer.states.length) {
            this.state.lexer.start = this.alias + directive.lexer.states[0].name;
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
                });
            }
            this.state.addLexerState(state);
        }
    }
    processGrammarDirective(directive) {
        if (directive.grammar.config) {
            if (directive.grammar.config.start) {
                this.state.grammar.start = this.alias + directive.grammar.config.start;
            }
            Object.assign(this.state.grammar.config, directive.grammar.config);
        }
        if (!this.state.grammar.start && directive.grammar.rules.length) {
            this.state.grammar.start = this.alias + directive.grammar.rules[0].name;
        }
        for (const rule of directive.grammar.rules) {
            rule.name = this.alias + rule.name;
            this.buildRules(rule.name, rule.expressions, rule);
        }
    }
    async importBuiltIn(name, alias) {
        name = name.toLowerCase();
        if (!this.context.imported.has(name)) {
            this.context.imported.add(name);
            if (!BuiltInRegistry[name])
                return;
            await this.mergeLanguageDefinitionString(BuiltInRegistry[name], alias);
        }
    }
    async importGrammar(path, alias) {
        const resolver = this.context.resolver;
        const fullPath = resolver.path(path);
        if (!this.context.imported.has(fullPath)) {
            this.context.imported.add(fullPath);
            await this.mergeLanguageDefinitionString(await resolver.body(fullPath), alias);
        }
    }
    async mergeLanguageDefinitionString(body, alias = '') {
        const builder = new Generator(this.config, this.context, alias);
        await builder.import(this.parser.run(body).results[0]);
        this.state.merge(builder.state);
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
exports.Generator = Generator;
//# sourceMappingURL=generator.js.map