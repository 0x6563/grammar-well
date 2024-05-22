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
export function Parse(language, input, options) {
    const i = new Parser(language, options);
    return i.run(input);
}
export class Parser {
    language;
    options;
    constructor(language, options = { algorithm: 'earley', parserOptions: {} }) {
        this.language = language;
        this.options = options;
    }
    run(input) {
        const tokenQueue = this.getTokenQueue();
        tokenQueue.feed(input);
        if (typeof this.options.algorithm == 'function')
            return this.options.algorithm({ ...this.language, tokens: tokenQueue, utility: ParserUtility }, this.options.parserOptions);
        return ParserRegistry[this.options.algorithm]({ ...this.language, tokens: tokenQueue, utility: ParserUtility }, this.options.parserOptions);
    }
    getTokenQueue() {
        const { lexer } = this.language;
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