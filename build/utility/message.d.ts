import { Lexer, RuleSymbol } from "../typings";
export declare class Message {
    static LexerTokenError(lexer: Lexer): string;
    static GetSymbolDisplay(symbol: RuleSymbol, short?: boolean, error?: boolean): string;
}
