import { ParserAlgorithm, RuntimeParserClass } from "../typings/index.js";
import { CharacterLexer } from "../lexers/character-lexer.js";
import { StatefulLexer } from "../lexers/stateful-lexer.js";
import { TokenBuffer } from "../lexers/token-buffer.js";
import { CYK } from "./algorithms/cyk.js";
import { Earley } from "./algorithms/earley.js";
import { LRK } from "./algorithms/lrk/algorithm.js";
import { ParserUtility } from "../utility/parsing.js";

const ParserRegistry: { [key: string]: ParserAlgorithm } = {
    earley: Earley,
    cyk: CYK,
    lr0: LRK
}

export function Parse(
    language: InstanceType<RuntimeParserClass>,
    input: string,
    options: ParserOptions = {
        algorithm: 'earley',
        parserOptions: {}
    },
    results: 'full' | 'first' = 'first'
) {
    const tokenizer = GetTokenizer(language.artifacts);
    tokenizer.feed(input);
    const algorithm = typeof options.algorithm == 'function' ? options.algorithm : ParserRegistry[options.algorithm];
    const result = algorithm({ ...language, tokens: tokenizer, utility: ParserUtility }, options.parserOptions);
    return results == 'full' ? result : result.results[0];
}

function GetTokenizer({ lexer }: RuntimeParserClass['artifacts']) {
    if (!lexer) {
        return new TokenBuffer(new CharacterLexer());
    } else if ("feed" in lexer && typeof lexer.feed == 'function') {
        return new TokenBuffer(lexer);
    } else if ('states' in lexer) {
        return new TokenBuffer(new StatefulLexer(lexer));
    }
}

interface ParserOptions {
    algorithm: (keyof typeof ParserRegistry) | ParserAlgorithm,
    parserOptions?: any;
}
