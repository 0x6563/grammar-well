import { CharacterLexer } from "../lexers/character-lexer";
import { StatefulLexer } from "../lexers/stateful-lexer";
import { TokenBuffer } from "../lexers/token-buffer";
import { CYK } from "./algorithms/cyk";
import { Earley } from "./algorithms/earley";
import { LRK } from "./algorithms/lrk/algorithm";
const ParserRegistry = {
    earley: Earley,
    cyk: CYK,
    lr0: LRK
};
export function Parse(language, input, options = {
    algorithm: 'earley',
    parserOptions: {}
}, results = 'first') {
    const tokenizer = GetTokenizer(language);
    tokenizer.feed(input);
    const algorithm = typeof options.algorithm == 'function' ? options.algorithm : ParserRegistry[options.algorithm];
    const result = algorithm({ ...language, tokens: tokenizer, utility: ParserUtility }, options.parserOptions);
    return results == 'full' ? result : result.results[0];
}
function GetTokenizer({ lexer }) {
    if (!lexer) {
        return new TokenBuffer(new CharacterLexer());
    }
    else if ("feed" in lexer && typeof lexer.feed == 'function') {
        return new TokenBuffer(lexer);
    }
    else if ('states' in lexer) {
        return new TokenBuffer(new StatefulLexer(lexer));
    }
}
export class ParserUtility {
    static SymbolMatchesToken(symbol, token) {
        if (typeof symbol === 'string')
            throw 'Attempted to match token against non-terminal';
        if (typeof symbol == 'function')
            return symbol(token);
        if (!symbol)
            return;
        if ("test" in symbol)
            return symbol.test(token.value);
        if ("token" in symbol)
            return symbol.token === token.type || token.tag?.has(symbol.token);
        if ("literal" in symbol)
            return symbol.literal === token.value;
    }
    static SymbolIsTerminal(symbol) {
        return typeof symbol != 'string';
    }
    static PostProcess(rule, data, meta) {
        if (rule.postprocess) {
            return rule.postprocess({ rule, data, meta });
        }
        return data;
    }
}
//# sourceMappingURL=parser.js.map