import type { Dictionary, RuntimeGrammarProductionRule, RuntimeParserClass } from "../../typings/index.ts";
import { TokenBuffer } from "../../lexers/token-buffer.ts";
export interface EarleyParserOptions {
    keepHistory?: boolean;
    postProcessing?: 'eager' | 'lazy';
}
export declare function Earley(language: RuntimeParserClass & {
    tokens: TokenBuffer;
}, options?: EarleyParserOptions): {
    results: any[];
    info: {
        table: Column[];
    };
};
declare class Column {
    data: any;
    states: State[];
    wants: Dictionary<State[]>;
    scannable: State[];
    completed: Dictionary<State[]>;
    private rules;
    index: number;
    private StateClass;
    constructor(rules: Dictionary<RuntimeGrammarProductionRule[]>, index: number, StateClass: Concrete<typeof State>);
    process(): void;
    predict(exp: string): void;
    expects(): RuntimeGrammarProductionRule[];
    private complete;
}
declare abstract class State {
    isComplete: boolean;
    data: any;
    left: State;
    right: State | StateToken;
    rule: RuntimeGrammarProductionRule;
    dot: number;
    reference: number;
    wantedBy: State[];
    constructor(rule: RuntimeGrammarProductionRule, dot: number, reference: number, wantedBy: State[]);
    nextState(child: State | StateToken): any;
    abstract finish(): void;
    protected build(): any[];
}
interface StateToken {
    data: any;
    token: any;
    isToken: boolean;
    reference: number;
}
type Concrete<T extends abstract new (...args: any) => any> = new (...args: ConstructorParameters<T>) => InstanceType<T>;
export {};
