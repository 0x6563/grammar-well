"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interpreter = void 0;
const parser_1 = require("../parsers/earley/parser");
const ParserRegistry = {
    'earley': parser_1.EarleyParser
};
class Interpreter {
    constructor(grammar, options = { parser: 'earley' }) {
        this.grammar = grammar;
        this.options = options;
        this.parserClass = ParserRegistry[options.parser];
        this.parser = new this.parserClass(this.grammar, options);
    }
    get results() {
        return this.parser.results;
    }
    feed(source) {
        this.parser.feed(source);
        return this.results;
    }
    run(source) {
        const parser = new this.parserClass(this.grammar, this.options);
        parser.feed(source);
        return parser.results[0];
    }
}
exports.Interpreter = Interpreter;
//# sourceMappingURL=interpreter.js.map