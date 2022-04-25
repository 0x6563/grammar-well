import { Grammar } from "./grammar";
import { State } from "./state";
import { Dictionary } from "../typings";
import { LexerState } from "./lexer";
export declare class Column {
    private grammar;
    index: number;
    lexerState: LexerState;
    states: State[];
    wants: Dictionary<State[]>;
    scannable: State[];
    completed: Dictionary<State[]>;
    constructor(grammar: Grammar, index: number);
    process(nextColumn?: any): void;
    predict(exp: string): void;
    complete(left: State, right: State): void;
}
