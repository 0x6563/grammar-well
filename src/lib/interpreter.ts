import { Parser, ParserConstructor, PrecompiledGrammar } from "../typings";
import { NearleyParser } from "../parsers/nearley/parser";
import { EarleyParser } from "../parsers/earley/parser";

const ParserRegistry = {
    'nearley': NearleyParser,
    'earley': EarleyParser
}

export function Interpret(grammar: PrecompiledGrammar, input: string, options?: InterpreterOptions) {
    const i = new Interpreter(grammar, options);
    return i.run(input);
}

export class Interpreter {
    parserClass: ParserConstructor;
    parser: Parser;

    get results() {
        return this.parser.results
    }

    constructor(private grammar: PrecompiledGrammar, private options: InterpreterOptions = { parser: 'nearley' }) {
        this.parserClass = ParserRegistry[options.parser];
        this.parser = new this.parserClass(this.grammar, options);
    }

    feed(input: string) {
        this.parser.feed(input);
        return this.results;
    }

    run(input: string) {
        const parser = new this.parserClass(this.grammar, this.options);
        parser.feed(input);
        return parser.results[0];
    }
}

interface InterpreterOptions {
    parser: keyof typeof ParserRegistry,
    parserOptions?: any
}