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
                rules: [],
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
                    this.state.head.push(directive.head);
                }
                else if ("body" in directive) {
                    if (this.config.noscript)
                        continue;
                    this.state.body.push(directive.body);
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
            if (directive.builtin) {
                this.importBuiltIn(directive.import);
            }
            else {
                yield this.importGrammar(directive.import);
            }
        });
    }
    processConfigDirective(directive) {
        Object.assign(this.state.config, directive.config);
    }
    processGrammarDirective(directive) {
        for (const rule of directive.grammar.rules) {
            this.buildRules(rule.name, rule.rules, {});
            this.state.grammar.start = this.state.grammar.start || rule.name;
        }
    }
    processLexerDirective(directive) {
        if (!this.state.lexer) {
            this.state.lexer = {
                start: '',
                states: []
            };
        }
        this.state.lexer.start = directive.lexer.start || this.state.lexer.start;
        this.state.lexer.states.push(...directive.lexer.states);
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
        this.state.grammar.rules.push(...state.grammar.rules);
        this.state.grammar.start = state.grammar.start || this.state.grammar.start;
        if (state.lexer) {
            if (this.state.lexer) {
                this.state.lexer.states.push(...state.lexer.states);
                this.state.lexer.start = state.lexer.start || this.state.lexer.start;
            }
            else {
                this.state.lexer = state.lexer;
            }
        }
        this.state.head.push(...state.head);
        this.state.body.push(...state.body);
        Object.assign(this.state.config, state.config);
    }
    uuid(name) {
        this.state.grammar.names[name] = (this.state.grammar.names[name] || 0) + 1;
        return name + 'x' + this.state.grammar.names[name];
    }
    buildRules(name, rules, scope) {
        for (let i = 0; i < rules.length; i++) {
            const rule = this.buildRule(name, rules[i], scope);
            this.state.grammar.rules.push(rule);
        }
    }
    buildRule(name, rule, scope) {
        const symbols = [];
        for (let i = 0; i < rule.symbols.length; i++) {
            const symbol = this.buildSymbol(name, rule.symbols[i], scope);
            if (symbol !== null) {
                symbols.push(symbol);
            }
        }
        return { name, symbols, postprocess: this.config.noscript ? null : rule.postprocess };
    }
    buildSymbol(name, symbol, scope) {
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
    buildCharacterRules(name, symbol, scope) {
        const id = this.uuid(name + "$STR");
        this.buildRules(id, [
            {
                symbols: symbol.literal.split("").map((literal) => ({ literal })),
                postprocess: { builtin: "join" }
            }
        ], scope);
        return { rule: id };
    }
    buildSubExpressionRules(name, symbol, scope) {
        const id = this.uuid(name + "$SUB");
        this.buildRules(id, symbol.subexpression, scope);
        return { rule: id };
    }
    buildRepeatRules(name, symbol, scope) {
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
        this.buildRules(id, [expr1, expr2], scope);
        return { rule: id };
    }
}
exports.Compiler = Compiler;
//# sourceMappingURL=compiler.js.map