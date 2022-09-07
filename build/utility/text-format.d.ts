import { TokenQueue } from "../lexers/token-queue";
import { GrammarRule, GrammarRuleSymbol, LexerToken } from "../typings";
export declare class TextFormatter {
    static UnexpectedToken(queue: TokenQueue, expected: (GrammarRule & {
        index?: number;
    })[]): string;
    static LexerTokenShort(token: LexerToken): string;
    static LexerTokenError(lexer: TokenQueue): string;
    static GrammarRuleSymbol(symbol: GrammarRuleSymbol, short?: boolean, error?: boolean): string;
    static GrammarRule(rule: GrammarRule, withCursorAt?: number): string;
}
