import { State } from "./state";
import { Dictionary, TokenQueueRestorePoint, GrammarRule } from "../../../typings";
export declare class Column {
    private ruleMap;
    index: number;
    restorePoint: TokenQueueRestorePoint;
    data: any;
    states: State[];
    wants: Dictionary<State[]>;
    scannable: State[];
    completed: Dictionary<State[]>;
    constructor(ruleMap: Dictionary<GrammarRule[]>, index: number);
    process(): void;
    predict(exp: string): void;
    private complete;
}
