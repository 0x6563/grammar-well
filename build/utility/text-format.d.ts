import { TokenBuffer } from "../lexers/token-buffer.ts";
import type { RuntimeGrammarProductionRule, RuntimeGrammarRuleSymbol, RuntimeLexerToken } from "../typings/index.ts";
export declare class TextFormatter {
    static UnexpectedToken(queue: TokenBuffer, expected: (RuntimeGrammarProductionRule & {
        index?: number;
    })[]): string;
    static LexerTokenShort(token: RuntimeLexerToken): string;
    static LexerTokenError(lexer: TokenBuffer): string;
    static GrammarRuleSymbol(symbol: RuntimeGrammarRuleSymbol, short?: boolean, error?: boolean): string;
    static GrammarRule(rule: RuntimeGrammarProductionRule, withCursorAt?: number): string;
}
