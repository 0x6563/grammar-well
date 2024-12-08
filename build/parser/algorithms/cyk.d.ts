import { RuntimeGrammarProductionRule, RuntimeParserClass, RuntimeLexerToken } from "../../typings/index.js";
import { TokenBuffer } from "../../lexers/token-buffer.js";
export declare function CYK(language: RuntimeParserClass & {
    tokens: TokenBuffer;
}, _options?: {}): {
    results: any[];
};
export interface NonTerminal {
    rule: RuntimeGrammarProductionRule;
    left: NonTerminal | Terminal;
    right: NonTerminal | Terminal;
}
export interface Terminal {
    rule: RuntimeGrammarProductionRule;
    token: RuntimeLexerToken;
}
