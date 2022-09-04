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
exports.Generator = void 0;
const parser_1 = require("../parser/parser");
const number = require("../grammars/number.json");
const string = require("../grammars/string.json");
const whitespace = require("../grammars/whitespace.json");
const gwell_1 = require("../grammars/gwell");
const BuiltInRegistry = {
    number,
    string,
    whitespace,
};
class Generator {
    constructor(config, compilerState) {
        this.config = config;
        this.compilerState = compilerState;
        this.parser = new parser_1.Parser((0, gwell_1.default)(), { algorithm: 'earley' });
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
        this.state.version = config.version || this.state.version;
    }
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
    export() {
        return this.state;
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
        if (!this.compilerState.alreadycompiled.has(name)) {
            this.compilerState.alreadycompiled.add(name);
            if (!BuiltInRegistry[name])
                return;
            this.merge(BuiltInRegistry[name].state);
        }
    }
    importGrammar(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const resolver = this.compilerState.resolver;
            const path = resolver.path(name);
            if (!this.compilerState.alreadycompiled.has(path)) {
                this.compilerState.alreadycompiled.add(path);
                yield this.mergeLanguageDefinitionString(yield resolver.body(path));
            }
        });
    }
    mergeLanguageDefinitionString(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const builder = new Generator(this.config, this.compilerState);
            yield builder.import(this.parser.run(body));
            const state = builder.export();
            this.merge(state);
            return state;
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
        return name + '$' + this.state.grammar.names[name];
    }
    buildRules(name, rules, scope) {
        for (let i = 0; i < rules.length; i++) {
            const rule = this.buildRule(name, rules[i], scope);
            if (this.config.noscript) {
                rule.postprocess = null;
            }
            this.state.grammar.rules.push(rule);
        }
    }
    buildRule(name, rule, scope) {
        const symbols = [];
        for (let i = 0; i < rule.tokens.length; i++) {
            const symbol = this.buildSymbol(name, rule.tokens[i], scope);
            if (symbol !== null) {
                symbols.push(symbol);
            }
        }
        return { name, symbols, postprocess: rule.postprocess };
    }
    buildSymbol(name, token, scope) {
        if (typeof token === 'string') {
            return token === 'null' ? null : token;
        }
        if ('regex' in token) {
            return token;
        }
        if ('literal' in token) {
            if (!token.literal.length) {
                return null;
            }
            if (token.literal.length === 1 || this.state.lexer) {
                return token;
            }
            return this.buildStringToken(name, token, scope);
        }
        if ('token' in token) {
            const name = token.token;
            return { token: `{ type: ${JSON.stringify(name)}}` };
        }
        if ('subexpression' in token) {
            return this.buildSubExpressionToken(name, token, scope);
        }
        if ('ebnf' in token) {
            return this.buildEBNFToken(name, token, scope);
        }
        throw new Error("unrecognized token: " + JSON.stringify(token));
    }
    buildStringToken(name, token, scope) {
        const id = this.uuid(name + "$string");
        this.buildRules(id, [
            {
                tokens: token.literal.split("").map((literal) => ({ literal })),
                postprocess: { builtin: "joiner" }
            }
        ], scope);
        return id;
    }
    buildSubExpressionToken(name, token, scope) {
        const id = this.uuid(name + "$subexpression");
        this.buildRules(id, token.subexpression, scope);
        return id;
    }
    buildEBNFToken(name, token, scope) {
        const id = this.uuid(name + "$ebnf");
        let expr1 = { tokens: [] };
        let expr2 = { tokens: [] };
        if (token.modifier == '+') {
            expr1.tokens = [token.ebnf];
            expr2.tokens = [id, token.ebnf];
            expr2.postprocess = { builtin: "arrpush" };
        }
        else if (token.modifier == '*') {
            expr2.tokens = [id, token.ebnf];
            expr2.postprocess = { builtin: "arrpush" };
        }
        else if (token.modifier == '?') {
            expr1.tokens = [token.ebnf];
            expr1.postprocess = { builtin: "id" };
            expr2.postprocess = { builtin: "nuller" };
        }
        this.buildRules(id, [expr1, expr2], scope);
        return id;
    }
}
exports.Generator = Generator;
//# sourceMappingURL=generator.js.map