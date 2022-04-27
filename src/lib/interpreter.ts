import { Grammar, PrecompiledGrammar } from "./grammar";
import { Parser, ParserOptions } from "./parser";

export class Interpreter {
    grammar: Grammar;
    parser: Parser;

    get results() {
        return this.parser.results
    }

    constructor(grammar: PrecompiledGrammar, private options?: ParserOptions) {
        this.grammar = Grammar.fromCompiled(grammar);
        this.parser = new Parser(this.grammar, options);
    }

    feed(source: string) {
        this.parser.feed(source);
    }

    run(source: string) {
        const parser = new Parser(this.grammar, this.options);
        parser.feed(source);
        return parser.results[0];
    }
}