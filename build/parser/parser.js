"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserUtility = exports.Parser = exports.Parse = void 0;
const character_lexer_1 = require("../lexers/character-lexer");
const stateful_lexer_1 = require("../lexers/stateful-lexer");
const token_buffer_1 = require("../lexers/token-buffer");
const cyk_1 = require("./algorithms/cyk");
const earley_1 = require("./algorithms/earley");
const lr_1 = require("./algorithms/lr");
const ParserRegistry = {
    earley: earley_1.Earley,
    cyk: cyk_1.CYK,
    lr0: lr_1.LR
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
            return this.options.algorithm(Object.assign(Object.assign({}, this.language), { tokens: tokenQueue, utility: ParserUtility }), this.options.parserOptions);
        return ParserRegistry[this.options.algorithm](Object.assign(Object.assign({}, this.language), { tokens: tokenQueue, utility: ParserUtility }), this.options.parserOptions);
    }
    getTokenQueue() {
        const { lexer } = this.language;
        if (!lexer) {
            return new token_buffer_1.TokenBuffer(new character_lexer_1.CharacterLexer());
        }
        else if ("feed" in lexer && typeof lexer.feed == 'function') {
            return new token_buffer_1.TokenBuffer(lexer);
        }
        else if ('states' in lexer) {
            return new token_buffer_1.TokenBuffer(new stateful_lexer_1.StatefulLexer(lexer));
        }
    }
}
exports.Parser = Parser;
class ParserUtility {
    static SymbolMatchesToken(symbol, token) {
        var _a;
        if (typeof symbol === 'string')
            throw 'Attempted to match token against non-terminal';
        if (typeof symbol == 'function')
            return symbol(token);
        if (!symbol)
            return;
        if ("test" in symbol)
            return symbol.test(token.value);
        if ("token" in symbol)
            return symbol.token === token.type || ((_a = token.tag) === null || _a === void 0 ? void 0 : _a.has(symbol.token));
        if ("literal" in symbol)
            return symbol.literal === token.value;
    }
    static SymbolIsTerminal(symbol) {
        return typeof symbol != 'string';
    }
    static PostProcess(rule, data, meta) {
        if (rule.postprocess) {
            return rule.postprocess({ rule, data, meta });
        }
        return data;
    }
}
exports.ParserUtility = ParserUtility;
//# sourceMappingURL=parser.js.map