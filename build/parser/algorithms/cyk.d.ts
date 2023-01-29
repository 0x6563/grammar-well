import { TokenBuffer } from "../../lexers/token-buffer";
import { GrammarRule, LanguageDefinition, LexerToken } from "../../typings";
export declare function CYK(language: LanguageDefinition & {
    tokens: TokenBuffer;
}, options?: {}): {
    results: any[];
};
export interface NonTerminal {
    rule: GrammarRule;
    left: NonTerminal | Terminal;
    right: NonTerminal | Terminal;
}
export interface Terminal {
    rule: GrammarRule;
    token: LexerToken;
}
