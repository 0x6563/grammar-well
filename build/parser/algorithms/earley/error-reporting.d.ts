import { EarleyParser } from "./earley";
export declare class ParserErrorService {
    private parser;
    constructor(parser: EarleyParser);
    tokenError(token: any): any;
    private displayStateStack;
    private reportErrorCommon;
    private buildFirstStateStack;
}
