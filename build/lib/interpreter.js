"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interpreter = void 0;
const grammar_1 = require("./grammar");
const parser_1 = require("./parser");
class Interpreter {
    constructor(grammar, options) {
        this.options = options;
        this.grammar = grammar_1.Grammar.fromCompiled(grammar);
        this.parser = new parser_1.Parser(this.grammar, options);
    }
    get results() {
        return this.parser.results;
    }
    feed(source) {
        this.parser.feed(source);
    }
    run(source) {
        const parser = new parser_1.Parser(this.grammar, this.options);
        parser.feed(source);
        return parser.results[0];
    }
}
exports.Interpreter = Interpreter;
//# sourceMappingURL=interpreter.js.map