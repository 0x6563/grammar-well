import { CharacterLexer } from "../lexers/character-lexer.js";
import { StatefulLexer } from "../lexers/stateful-lexer.js";
import { TokenBuffer } from "../lexers/token-buffer.js";
import { CYK } from "./algorithms/cyk.js";
import { Earley } from "./algorithms/earley.js";
import { LRK } from "./algorithms/lrk/algorithm.js";
import { ParserUtility } from "../utility/parsing.js";
import { NOOP } from "./algorithms/noop.js";
const ParserRegistry = {
    earley: Earley,
    cyk: CYK,
    lr0: LRK,
    noop: NOOP
};
export function Parse(language, input, options = {
    algorithm: 'earley',
    parserOptions: {}
}, results = 'first') {
    const tokenizer = GetTokenizer(language.artifacts);
    tokenizer.feed(input);
    const algorithm = typeof options.algorithm == 'function' ? options.algorithm : ParserRegistry[options.algorithm];
    const result = algorithm({ ...language, tokens: tokenizer, utility: ParserUtility }, options.parserOptions);
    return results == 'full' ? result : result.results[0];
}
function GetTokenizer(artifacts) {
    const tokenProcessor = artifacts?.tokenProcessor ? artifacts.tokenProcessor() : null;
    if (!artifacts.lexer) {
        return new TokenBuffer(new CharacterLexer(), tokenProcessor);
    }
    else if ("feed" in artifacts.lexer && typeof artifacts.lexer.feed == 'function') {
        return new TokenBuffer(artifacts.lexer, tokenProcessor);
    }
    else if ('states' in artifacts.lexer) {
        return new TokenBuffer(new StatefulLexer(artifacts.lexer), tokenProcessor);
    }
}
//# sourceMappingURL=parse.js.map