import { TokenBuffer } from "../../lexers/token-buffer";
import { GrammarRule, LanguageDefinition, LexerToken } from "../../typings";
export declare function CYK(language: LanguageDefinition & {
    tokens: TokenBuffer;
}, options?: {}): {
    results: any[];
};
export interface NonTerminal {
    rule: GrammarRule;
    left: NonTerminal | Terminal;
    right: NonTerminal | Terminal;
}
export interface Terminal {
    rule: GrammarRule;
    token: LexerToken;
}
export declare class Matrix<T> {
    private initial?;
    private $x;
    private $y;
    get x(): number;
    set x(x: number);
    get y(): number;
    set y(y: number);
    matrix: GetCallbackOrValue<T>[][];
    constructor(x: number, y: number, initial?: T | ((...args: any) => T));
    get(x: number, y: number): T;
    set(x: number, y: number, value: any): any;
    resize(x: number, y: number): void;
    static Array<T>(length: any, initial?: T | ((...args: any) => T)): GetCallbackOrValue<T>[];
}
declare type GetCallbackOrValue<T> = T extends (...args: any) => any ? ReturnType<T> : T;
export {};
