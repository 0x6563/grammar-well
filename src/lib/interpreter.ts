import { Parser, ParserOptions, PrecompiledGrammar } from "./parser";

export class Interpreter {
    parser: Parser;

    get results() {
        return this.parser.results
    }

    constructor(private grammar: PrecompiledGrammar, private options?: ParserOptions) {
        this.parser = new Parser(this.grammar, options);
    }

    feed(source: string) {
        this.parser.feed(source);
        return this.results;
    }

    run(source: string) {
        const parser = new Parser(this.grammar, this.options);
        parser.feed(source);
        return parser.results[0];
    }
}