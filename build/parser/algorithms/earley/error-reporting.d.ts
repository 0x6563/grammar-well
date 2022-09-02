import { GrammarRule } from "../../../typings";
import { EarleyParser } from "./parser";
import { State } from "./state";
export declare class ParserErrorService {
    private parser;
    constructor(parser: EarleyParser);
    lexerError(lexerError: any): string;
    tokenError(token: any): any;
    private displayStateStack;
    private reportErrorCommon;
    buildFirstStateStack(state: State, visited: Set<State>): any;
    formatRule(rule: GrammarRule, withCursorAt?: number): string;
}
