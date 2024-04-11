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
    private tags;
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
        tag: Set<string>;
        value: string;
        text: string;
        offset: number;
        line: number;
        column: number;
        state: string;
    };
    private set;
    private pop;
    private goto;
    private matchNext;
    private createToken;
    private getTags;
    private adjustStack;
    private getGroup;
}
export declare function ResolveStates(states: {
    [key: string]: LexerStateDefinition;
}, start: string): {
    [key: string]: LexerStateDefinition;
};
