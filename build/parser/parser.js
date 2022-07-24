"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = exports.Parse = void 0;
const parser_1 = require("./algorithms/nearley/parser");
const parser_2 = require("./algorithms/earley/parser");
const ParserRegistry = {
    'nearley': parser_1.NearleyParser,
    'earley': parser_2.EarleyParser
};
function Parse(grammar, input, options) {
    const i = new Parser(grammar, options);
    return i.run(input);
}
exports.Parse = Parse;
class Parser {
    constructor(grammar, options = { algorithm: 'nearley' }) {
        this.grammar = grammar;
        this.options = options;
        this.parserClass = ParserRegistry[options.algorithm];
        this.parser = new this.parserClass(this.grammar, options.parserOptions);
    }
    get results() {
        return this.parser.results;
    }
    feed(input) {
        this.parser.feed(input);
        return this.results;
    }
    run(input) {
        const parser = new this.parserClass(this.grammar, this.options.parserOptions);
        parser.feed(input);
        return parser.results[0];
    }
}
exports.Parser = Parser;
//# sourceMappingURL=parser.js.map