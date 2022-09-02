import { Lexer } from "../typings";
export declare class CharacterLexer implements Lexer {
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
