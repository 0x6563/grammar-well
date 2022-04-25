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
    formatError(token: any, message?: string): string;
    next(): any;
    save(): LexerState;
}
export interface LexerState {
    line: number;
    col: number;
}
