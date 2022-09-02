import { Column } from "./column";
import { Dictionary, Lexer, LexerConfig, TokenQueueRestorePoint, ParserAlgorithm, LanguageDefinition, GrammarRule } from "../../../typings";
import { ParserErrorService } from "./error-reporting";
import { TokenQueue } from "../../../lexers/token-queue";
export interface ParserOptions {
    keepHistory?: boolean;
    lexer?: Lexer | LexerConfig;
}
export declare class EarleyParser implements ParserAlgorithm {
    static fail: symbol;
    keepHistory: boolean;
    current: number;
    rules: GrammarRule[];
    start: string;
    tokenQueue: TokenQueue;
    restorePoint: TokenQueueRestorePoint;
    table: Column[];
    results: any;
    errorService: ParserErrorService;
    ruleMap: Dictionary<GrammarRule[]>;
    constructor({ grammar, lexer }: LanguageDefinition, options?: ParserOptions);
    next(): import("../../../typings").LexerToken;
    feed(chunk: string): void;
    save(): Column;
    restore(column: Column): void;
    rewind(index: number): void;
    finish(): any[];
}
