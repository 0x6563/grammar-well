import { Dictionary, GrammarRuleSymbol } from "../typings";
export declare class Collection<T> {
    categorized: Dictionary<Dictionary<number>>;
    private uncategorized;
    items: T[];
    constructor(ref?: T[]);
    encode(ref: T): number;
    decode(id: number | string): T;
    has(ref: T): boolean;
    redirect(source: T, target: T): void;
    resolve(_: T): {
        category: keyof Collection<T>['categorized'];
        key: string;
    } | void;
    private addCategorized;
    private addUncategorized;
}
export declare class SymbolCollection extends Collection<GrammarRuleSymbol> {
    categorized: {
        nonTerminal: {};
        literalI: {};
        literalS: {};
        token: {};
        regex: {};
        function: {};
    };
    resolve(symbol: GrammarRuleSymbol): {
        category: string;
        key: string;
    };
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
export declare function Flatten(obj: any[] | {
    [key: string]: any;
}): FlatObject;
export declare function Unflatten(items: FlatObject): any;
type FlatObject = (boolean | number | string | (number[]) | {
    [key: string]: number;
})[];
type GetCallbackOrValue<T> = T extends (...args: any) => any ? ReturnType<T> : T;
export {};
