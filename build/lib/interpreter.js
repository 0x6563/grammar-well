"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interpreter = exports.Interpret = void 0;
const parser_1 = require("../parsers/nearley/parser");
const parser_2 = require("../parsers/earley/parser");
const ParserRegistry = {
    'nearley': parser_1.NearleyParser,
    'earley': parser_2.EarleyParser
};
function Interpret(grammar, input, options) {
    const i = new Interpreter(grammar, options);
    return i.run(input);
}
exports.Interpret = Interpret;
class Interpreter {
    constructor(grammar, options = { parser: 'nearley' }) {
        this.grammar = grammar;
        this.options = options;
        this.parserClass = ParserRegistry[options.parser];
        this.parser = new this.parserClass(this.grammar, options);
    }
    get results() {
        return this.parser.results;
    }
    feed(input) {
        this.parser.feed(input);
        return this.results;
    }
    run(input) {
        const parser = new this.parserClass(this.grammar, this.options);
        parser.feed(input);
        return parser.results[0];
    }
}
exports.Interpreter = Interpreter;
//# sourceMappingURL=interpreter.js.map