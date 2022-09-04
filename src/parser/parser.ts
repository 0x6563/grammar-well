import { CharacterLexer } from "../lexers/character-lexer";
import { StatefulLexer } from "../lexers/stateful-lexer";
import { TokenQueue } from "../lexers/token-queue";
import { ParserAlgorithm, ParserAlgorithmConstructor, LanguageDefinition } from "../typings";
import { EarleyParser } from "./algorithms/earley/earley";

const ParserRegistry = {
    'earley': EarleyParser
}

export function Parse(language: LanguageDefinition, input: string, options?: ParserOptions) {
    const i = new Parser(language, options);
    return i.run(input);
}

export class Parser {
    parserClass: ParserAlgorithmConstructor;
    parser: ParserAlgorithm;

    get results() {
        return this.parser.results
    }

    constructor(private language: LanguageDefinition, private options: ParserOptions = { algorithm: 'earley', parserOptions: {} }) {
        this.parserClass = ParserRegistry[options.algorithm];
        this.parser = this.getParserAlgo();
    }

    feed(input: string) {
        this.parser.feed(input);
        return this.results;
    }

    run(input: string) {
        const parser = this.getParserAlgo();
        parser.feed(input);
        return parser.results[0];
    }

    private getParserAlgo() {
        const { lexer } = this.language;
        let tokenQueue: TokenQueue;

        if (!lexer) {
            tokenQueue = new TokenQueue(new CharacterLexer());
        } else if ("feed" in lexer && typeof lexer.feed == 'function') {
            tokenQueue = new TokenQueue(lexer);
        } else if ('states' in lexer) {
            tokenQueue = new TokenQueue(new StatefulLexer(lexer));
        }

        return new this.parserClass({ ...this.language, tokenQueue }, this.options.parserOptions);
    }
}

interface ParserOptions {
    algorithm: keyof typeof ParserRegistry,
    parserOptions?: any;
}