"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = exports.Parse = void 0;
const parser_1 = require("./algorithms/earley/parser");
const ParserRegistry = {
    'earley': parser_1.EarleyParser
};
function Parse(language, input, options) {
    const i = new Parser(language, options);
    return i.run(input);
}
exports.Parse = Parse;
class Parser {
    constructor(language, options = { algorithm: 'earley' }) {
        this.language = language;
        this.options = options;
        this.parserClass = ParserRegistry[options.algorithm];
        this.parser = new this.parserClass(this.language, options.parserOptions);
    }
    get results() {
        return this.parser.results;
    }
    feed(input) {
        this.parser.feed(input);
        return this.results;
    }
    run(input) {
        const parser = new this.parserClass(this.language, this.options.parserOptions);
        parser.feed(input);
        return parser.results[0];
    }
}
exports.Parser = Parser;
//# sourceMappingURL=parser.js.map