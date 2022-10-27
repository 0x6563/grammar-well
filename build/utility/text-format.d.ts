import { TokenBuffer } from "../lexers/token-buffer";
import { GrammarRule, GrammarRuleSymbol, LexerToken } from "../typings";
export declare class TextFormatter {
    static UnexpectedToken(queue: TokenBuffer, expected: (GrammarRule & {
        index?: number;
    })[]): string;
    static LexerTokenShort(token: LexerToken): string;
    static LexerTokenError(lexer: TokenBuffer): string;
    static GrammarRuleSymbol(symbol: GrammarRuleSymbol, short?: boolean, error?: boolean): string;
    static GrammarRule(rule: GrammarRule, withCursorAt?: number): string;
}
