import { TokenQueue } from "../lexers/token-queue";
import { GrammarRule, GrammarRuleSymbol } from "../typings";
export declare class Message {
    static LexerTokenError(lexer: TokenQueue): string;
    static GetSymbolDisplay(symbol: GrammarRuleSymbol, short?: boolean, error?: boolean): string;
    static FormatGrammarRule(rule: GrammarRule, withCursorAt?: number): string;
}
