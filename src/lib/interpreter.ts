import { Parser, ParserConstructor, PrecompiledGrammar } from "../typings";
import { EarleyParser } from "../parsers/earley/parser";

const ParserRegistry = {
    'earley': EarleyParser
}

export class Interpreter {
    parserClass: ParserConstructor;
    parser: Parser;

    get results() {
        return this.parser.results
    }

    constructor(private grammar: PrecompiledGrammar, private options: InterpreterOptions = { parser: 'earley' }) {
        this.parserClass = ParserRegistry[options.parser];
        this.parser = new this.parserClass(this.grammar, options);
    }

    feed(source: string) {
        this.parser.feed(source);
        return this.results;
    }

    run(source: string) {
        const parser = new this.parserClass(this.grammar, this.options);
        parser.feed(source);
        return parser.results[0];
    }
}

interface InterpreterOptions {
    parser: keyof typeof ParserRegistry,
    parserOptions?: any
}