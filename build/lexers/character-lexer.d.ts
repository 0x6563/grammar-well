import type { RuntimeLexer } from "../typings/index.ts";
export declare class CharacterLexer implements RuntimeLexer {
    private buffer;
    private $indexOffset;
    private $index;
    get index(): number;
    private $lineOffset;
    private $line;
    get line(): number;
    private column;
    next(): {
        type: string;
        value: any;
        offset: number;
        line: number;
        column: number;
        custom: {};
    };
    feed(buffer: string | any[], state?: ReturnType<CharacterLexer['state']>): void;
    state(): {
        index: number;
        indexOffset: number;
        line: number;
        lineOffset: number;
        column: number;
    };
    flush(): void;
}
