import { LexerState } from "../typings";
export declare class StreamLexer {
    buffer: string;
    index: number;
    line: number;
    lastLineBreak: number;
    constructor();
    reset(data: string, state?: LexerState): void;
    next(): {
        value: string;
    };
    save(): LexerState;
    formatError(token: any, message: any): any;
}
