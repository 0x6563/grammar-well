import type { ParserAlgorithm, RuntimeParserClass } from "../typings/index.ts";
import { CharacterLexer } from "../lexers/character-lexer.ts";
import { StatefulLexer } from "../lexers/stateful-lexer.ts";
import { TokenBuffer } from "../lexers/token-buffer.ts";
import { CYK } from "./algorithms/cyk.ts";
import { Earley } from "./algorithms/earley.ts";
import { LRK } from "./algorithms/lrk/algorithm.ts";
import { ParserUtility } from "../utility/parsing.ts";
import { NOOP } from "./algorithms/noop.ts";

const ParserRegistry: { [key: string]: ParserAlgorithm } = {
    earley: Earley,
    cyk: CYK,
    lr0: LRK,
    noop: NOOP
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

function GetTokenizer(artifacts: RuntimeParserClass['artifacts']) {
    const tokenProcessor = artifacts?.tokenProcessor ? artifacts.tokenProcessor() : null;
    if (!artifacts.lexer) {
        return new TokenBuffer(new CharacterLexer(), tokenProcessor);
    } else if ("feed" in artifacts.lexer && typeof artifacts.lexer.feed == 'function') {
        return new TokenBuffer(artifacts.lexer, tokenProcessor);
    } else if ('states' in artifacts.lexer) {
        return new TokenBuffer(new StatefulLexer(artifacts.lexer), tokenProcessor);
    }
}

interface ParserOptions {
    algorithm: (keyof typeof ParserRegistry) | ParserAlgorithm,
    parserOptions?: any;
}
