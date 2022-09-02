import { TokenQueue } from "../lexers/token-queue";
import { RuleSymbol } from "../typings";
export declare class Message {
    static LexerTokenError(lexer: TokenQueue): string;
    static GetSymbolDisplay(symbol: RuleSymbol, short?: boolean, error?: boolean): string;
}
