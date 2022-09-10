"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compiler = exports.Compile = void 0;
const parser_1 = require("../parser/parser");
const import_resolver_1 = require("./import-resolver");
const gwell_1 = require("../grammars/gwell");
const javascript_1 = require("./outputs/javascript");
const typescript_1 = require("./outputs/typescript");
const json_1 = require("./outputs/json");
const number = require("../grammars/number.json");
const string = require("../grammars/string.json");
const whitespace = require("../grammars/whitespace.json");
const BuiltInRegistry = {
    number,
    string,
    whitespace,
};
const OutputFormats = {
    _default: javascript_1.JavascriptOutput,
    object: (grammar, exportName) => ({ grammar, exportName }),
    json: json_1.JSONFormatter,
    js: javascript_1.JavascriptOutput,
    javascript: javascript_1.JavascriptOutput,
    module: javascript_1.ESMOutput,
    esmodule: javascript_1.ESMOutput,
    ts: typescript_1.TypescriptFormat,
    typescript: typescript_1.TypescriptFormat
};
function Compile(rules, config = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const compiler = new Compiler(config);
        yield compiler.import(rules);
        return compiler.export(config.format);
    });
}
exports.Compile = Compile;
class Compiler {
    constructor(config = {}, context) {
        this.config = config;
        this.parser = new parser_1.Parser((0, gwell_1.default)());
        this.state = {
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
        };
        this.context = context || {
            alreadycompiled: new Set(),
            resolver: config.resolverInstance ? config.resolverInstance : config.resolver ? new config.resolver(config.basedir) : new import_resolver_1.FileSystemResolver(config.basedir),
        };
    }
    export(format, name = 'GWLanguage') {
        const grammar = this.state;
        const output = format || grammar.config.preprocessor || '_default';
        if (OutputFormats[output]) {
            return OutputFormats[output](grammar, name);
        }
        throw new Error("No such preprocessor: " + output);
    }
    ;
    import(directives) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof directives == 'string') {
                yield this.mergeLanguageDefinitionString(directives);
                return;
            }
            directives = Array.isArray(directives) ? directives : [directives];
            for (const directive of directives) {
                if ("head" in directive) {
                    if (this.config.noscript)
                        continue;
                    this.state.head.push(directive.head.js);
                }
                else if ("body" in directive) {
                    if (this.config.noscript)
                        continue;
                    this.state.body.push(directive.body.js);
                }
                else if ("import" in directive) {
                    yield this.processImportDirective(directive);
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
        });
    }
    processImportDirective(directive) {
        return __awaiter(this, void 0, void 0, function* () {
            if (directive.path) {
                yield this.importGrammar(directive.import);
            }
            else {
                this.importBuiltIn(directive.import);
            }
        });
    }
    processConfigDirective(directive) {
        Object.assign(this.state.config, directive.config);
    }
    processGrammarDirective(directive) {
        if (directive.grammar.config) {
            this.state.grammar.start = directive.grammar.config.start || this.state.grammar.start;
        }
        for (const rule of directive.grammar.rules) {
            this.buildRules(rule.name, rule.expressions, rule);
            this.state.grammar.start = this.state.grammar.start || rule.name;
        }
    }
    processLexerDirective(directive) {
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
    mergeLexerState(state) {
        this.state.lexer.states[state.name] = this.state.lexer.states[state.name] || { name: state.name, rules: [] };
        const target = this.state.lexer.states[state.name];
        target.default = typeof state.default == 'string' ? state.default : target.default;
        target.unmatched = typeof state.unmatched == 'string' ? state.unmatched : target.unmatched;
        target.rules.push(...state.rules);
    }
    importBuiltIn(name) {
        name = name.toLowerCase();
        if (!this.context.alreadycompiled.has(name)) {
            this.context.alreadycompiled.add(name);
            if (!BuiltInRegistry[name])
                return;
            this.merge(BuiltInRegistry[name].state);
        }
    }
    importGrammar(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const resolver = this.context.resolver;
            const path = resolver.path(name);
            if (!this.context.alreadycompiled.has(path)) {
                this.context.alreadycompiled.add(path);
                yield this.mergeLanguageDefinitionString(yield resolver.body(path));
            }
        });
    }
    mergeLanguageDefinitionString(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const builder = new Compiler(this.config, this.context);
            yield builder.import(this.parser.run(body).results[0]);
            this.merge(builder.state);
            return builder.state;
        });
    }
    merge(state) {
        Object.assign(this.state.grammar.rules, state.grammar.rules);
        this.state.grammar.start = state.grammar.start || this.state.grammar.start;
        if (state.lexer) {
            if (this.state.lexer) {
                Object.assign(this.state.lexer.states, state.lexer.states);
            }
            else {
                this.state.lexer = state.lexer;
            }
            this.state.lexer.start = state.lexer.start || this.state.lexer.start;
        }
        this.state.head.push(...state.head);
        this.state.body.push(...state.body);
        Object.assign(this.state.config, state.config);
    }
    uuid(name) {
        this.state.grammar.names[name] = (this.state.grammar.names[name] || 0) + 1;
        return name + 'x' + this.state.grammar.names[name];
    }
    buildRules(name, expressions, rule) {
        for (let i = 0; i < expressions.length; i++) {
            const r = this.buildRule(name, expressions[i], rule);
            this.state.grammar.rules[r.name] = this.state.grammar.rules[r.name] || [];
            this.state.grammar.rules[r.name].push(r);
        }
    }
    buildRule(name, expression, rule) {
        const symbols = [];
        for (let i = 0; i < expression.symbols.length; i++) {
            const symbol = this.buildSymbol(name, expression.symbols[i]);
            if (symbol)
                symbols.push(symbol);
        }
        return { name, symbols, postprocess: this.config.noscript ? null : expression.postprocess || (rule === null || rule === void 0 ? void 0 : rule.postprocess) };
    }
    buildSymbol(name, symbol) {
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
    buildCharacterRules(name, symbol) {
        const id = this.uuid(name + "$STR");
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
        const id = this.uuid(name + "$SUB");
        this.buildRules(id, symbol.subexpression);
        return { rule: id };
    }
    buildRepeatRules(name, symbol) {
        let id;
        let expr1 = { symbols: [] };
        let expr2 = { symbols: [] };
        if (symbol.repeat == '+') {
            id = this.uuid(name + "$RPT1N");
            expr1.symbols = [symbol.expression];
            expr2.symbols = [{ rule: id }, symbol.expression];
            expr2.postprocess = { builtin: "concat" };
        }
        else if (symbol.repeat == '*') {
            id = this.uuid(name + "$RPT0N");
            expr2.symbols = [{ rule: id }, symbol.expression];
            expr2.postprocess = { builtin: "concat" };
        }
        else if (symbol.repeat == '?') {
            id = this.uuid(name + "$RPT01");
            expr1.symbols = [symbol.expression];
            expr1.postprocess = { builtin: "first" };
            expr2.postprocess = { builtin: "null" };
        }
        this.buildRules(id, [expr1, expr2]);
        return { rule: id };
    }
}
exports.Compiler = Compiler;
//# sourceMappingURL=compiler.js.map