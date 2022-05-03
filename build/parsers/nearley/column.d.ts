import { State } from "./state";
import { Dictionary, Rule } from "../../typings";
import { LexerState } from "../../lib/lexer";
export declare class Column {
    private ruleMap;
    index: number;
    lexerState: LexerState;
    states: State[];
    wants: Dictionary<State[]>;
    scannable: State[];
    completed: Dictionary<State[]>;
    constructor(ruleMap: Dictionary<Rule[]>, index: number);
    process(nextColumn?: any): void;
    predict(exp: string): void;
    private complete;
}
