import { RuntimeLexer, RuntimeLexerConfig } from "../typings";
export declare class StatefulLexer implements RuntimeLexer {
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
    constructor({ states, start }: RuntimeLexerConfig);
    feed(data?: string, state?: ReturnType<StatefulLexer['state']>): void;
    state(): {
        line: number;
        column: number;
        state: string;
        stack: string[];
        prefetched: RegExpExecArray;
    };
    next(skipped?: boolean): {
        type: any;
        highlight: any;
        open: any;
        close: any;
        tag: Set<string>;
        value: any;
        text: any;
        offset: any;
        line: number;
        lines: number;
        column: number;
        state: string;
    };
    private set;
    private pop;
    private goto;
    private matchNext;
    private getTags;
    private adjustPosition;
    private adjustStack;
    private getGroup;
}
