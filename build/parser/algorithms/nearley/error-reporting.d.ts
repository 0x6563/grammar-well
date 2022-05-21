import { Rule } from "../../../typings";
import { NearleyParser } from "./parser";
import { State } from "./state";
export declare class ParserErrorService {
    private parser;
    constructor(parser: NearleyParser);
    lexerError(lexerError: any): string;
    tokenError(token: any): any;
    private displayStateStack;
    private reportErrorCommon;
    buildFirstStateStack(state: State, visited: Set<State>): any;
    formatRule(rule: Rule, withCursorAt?: number): string;
}
