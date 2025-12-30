import type { RuntimeGrammarProductionRule, RuntimeParserClass, RuntimeLexerToken } from "../../typings/index.ts";
import { TokenBuffer } from "../../lexers/token-buffer.ts";
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
