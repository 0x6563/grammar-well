import { RuntimeGrammarProductionRule, RuntimeLanguageDefinition, RuntimeLexerToken } from "../../typings";
import { TokenBuffer } from "../../lexers/token-buffer.js";
export declare function CYK(language: RuntimeLanguageDefinition & {
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
