import { ParserAlgorithm, ParserConstructor, PrecompiledGrammar } from "../typings";
import { NearleyParser } from "./algorithms/nearley/parser";
import { EarleyParser } from "./algorithms/earley/parser";

const ParserRegistry = {
    'nearley': NearleyParser,
    'earley': EarleyParser
}

export function Parse(grammar: PrecompiledGrammar, input: string, options?: ParserOptions) {
    const i = new Parser(grammar, options);
    return i.run(input);
}

export class Parser {
    parserClass: ParserConstructor;
    parser: ParserAlgorithm;

    get results() {
        return this.parser.results
    }

    constructor(private grammar: PrecompiledGrammar, private options: ParserOptions = { algorithm: 'nearley' }) {
        this.parserClass = ParserRegistry[options.algorithm];
        this.parser = new this.parserClass(this.grammar, options.parserOptions);
    }

    feed(input: string) {
        this.parser.feed(input);
        return this.results;
    }

    run(input: string) {
        const parser = new this.parserClass(this.grammar, this.options.parserOptions);
        parser.feed(input);
        return parser.results[0];
    }
}

interface ParserOptions {
    algorithm: keyof typeof ParserRegistry,
    parserOptions?: any;
}