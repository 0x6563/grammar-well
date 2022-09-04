import { LexerStateDefinition, LexerConfig } from "../typings";
export declare class StatefulLexer {
    private start;
    private states;
    private buffer;
    private stack;
    private index;
    private line;
    private column;
    private prefetched?;
    private current;
    private unmatched;
    private rules;
    private regexp;
    constructor({ states, start }: LexerConfig);
    feed(data?: string, state?: ReturnType<StatefulLexer['state']>): void;
    state(): {
        line: number;
        column: number;
        state: string;
        stack: string[];
        prefetched: RegExpExecArray;
    };
    next(): {
        type: string;
        value: string;
        text: string;
        offset: number;
        line: number;
        column: number;
        state: string;
    };
    [Symbol.iterator](): LexerIterator;
    private set;
    private pop;
    private goto;
    private matchNext;
    private createToken;
    private processRule;
    private getGroup;
}
declare class LexerIterator {
    private lexer;
    constructor(lexer: StatefulLexer);
    next(): {
        value: {
            type: string;
            value: string;
            text: string;
            offset: number;
            line: number;
            column: number;
            state: string;
        };
        done: boolean;
    };
    [Symbol.iterator](): this;
}
export declare function ResolveStates(states: LexerStateDefinition[], start: string): {
    [key: string]: LexerStateDefinition;
};
export {};
