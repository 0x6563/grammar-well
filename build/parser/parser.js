"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = exports.Parse = void 0;
const character_lexer_1 = require("../lexers/character-lexer");
const stateful_lexer_1 = require("../lexers/stateful-lexer");
const token_queue_1 = require("../lexers/token-queue");
const earley_1 = require("./algorithms/earley");
const ParserRegistry = {
    'earley': earley_1.Earley
};
function Parse(language, input, options) {
    const i = new Parser(language, options);
    return i.run(input);
}
exports.Parse = Parse;
class Parser {
    constructor(language, options = { algorithm: 'earley', parserOptions: {} }) {
        this.language = language;
        this.options = options;
    }
    run(input) {
        const tokenQueue = this.getTokenQueue();
        tokenQueue.feed(input);
        if (typeof this.options.algorithm == 'function')
            return this.options.algorithm(Object.assign(Object.assign({}, this.language), { tokens: tokenQueue }), this.options.parserOptions);
        return ParserRegistry[this.options.algorithm](Object.assign(Object.assign({}, this.language), { tokens: tokenQueue }), this.options.parserOptions);
    }
    getTokenQueue() {
        const { lexer } = this.language;
        if (!lexer) {
            return new token_queue_1.TokenQueue(new character_lexer_1.CharacterLexer());
        }
        else if ("feed" in lexer && typeof lexer.feed == 'function') {
            return new token_queue_1.TokenQueue(lexer);
        }
        else if ('states' in lexer) {
            return new token_queue_1.TokenQueue(new stateful_lexer_1.StatefulLexer(lexer));
        }
    }
    static SymbolMatchesToken(rule, token) {
        var _a;
        if (typeof rule == 'function')
            return rule(token);
        if ("test" in rule)
            return rule.test(token.value);
        if ("token" in rule)
            return rule.token === token.type || ((_a = token.tag) === null || _a === void 0 ? void 0 : _a.has(rule.token));
        if ("literal" in rule)
            return rule.literal === token.value;
    }
    static PostProcessGrammarRule(rule, data, meta) {
        if (rule.postprocess) {
            return rule.postprocess({
                rule,
                data,
                meta,
                reject: Parser.Reject
            });
        }
        return data;
    }
}
exports.Parser = Parser;
Parser.Reject = Symbol();
//# sourceMappingURL=parser.js.map