import { Token } from "../typings";
export declare class StreamLexer implements Lexer {
    private index;
    private buffer;
    private line;
    private lastLineBreak;
    reset(data: string, state?: LexerState): void;
    next(): {
        value: string;
    };
    save(): LexerState;
    formatError(token: any, message: any): any;
}
export interface Lexer {
    reset(chunk?: string, state?: LexerState): void;
    formatError(token: Token, message?: string): string;
    next(): Token | undefined;
    save(): LexerState;
}
export interface LexerState {
    line: number;
    col: number;
}
