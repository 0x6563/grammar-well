"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = exports.Parse = void 0;
const character_lexer_1 = require("../lexers/character-lexer");
const stateful_lexer_1 = require("../lexers/stateful-lexer");
const token_queue_1 = require("../lexers/token-queue");
const earley_1 = require("./algorithms/earley/earley");
const ParserRegistry = {
    'earley': earley_1.EarleyParser
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
        this.parserClass = ParserRegistry[options.algorithm];
        this.parser = this.getParserAlgo();
    }
    get results() {
        return this.parser.results;
    }
    feed(input) {
        this.parser.feed(input);
        return this.results;
    }
    run(input) {
        const parser = this.getParserAlgo();
        parser.feed(input);
        return parser.results[0];
    }
    getParserAlgo() {
        const { lexer } = this.language;
        let tokenQueue;
        if (!lexer) {
            tokenQueue = new token_queue_1.TokenQueue(new character_lexer_1.CharacterLexer());
        }
        else if ("feed" in lexer && typeof lexer.feed == 'function') {
            tokenQueue = new token_queue_1.TokenQueue(lexer);
        }
        else if ('states' in lexer) {
            tokenQueue = new token_queue_1.TokenQueue(new stateful_lexer_1.StatefulLexer(lexer));
        }
        return new this.parserClass(Object.assign(Object.assign({}, this.language), { tokenQueue }), this.options.parserOptions);
    }
}
exports.Parser = Parser;
//# sourceMappingURL=parser.js.map