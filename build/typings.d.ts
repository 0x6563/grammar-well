import { TokenQueue } from "./lexers/token-queue";
export interface CompileOptions {
    version?: string;
    noscript?: boolean;
    basedir?: string;
    resolver?: ImportResolverConstructor;
    resolverInstance?: ImportResolver;
    exportName?: string;
    format?: OutputFormat;
}
export declare type OutputFormat = '_default' | 'object' | 'json' | 'js' | 'javascript' | 'module' | 'esmodule' | 'ts' | 'typescript';
export interface CompilerContext {
    alreadycompiled: Set<string>;
    resolver: ImportResolver;
}
export declare type PostProcessor = (payload: PostProcessorPayload) => any;
export interface ImportResolver {
    path(path: string): string;
    body(path: string): Promise<string>;
}
export interface ImportResolverConstructor {
    new (basePath: string): ImportResolver;
}
interface PostProcessorPayload {
    data: any[];
    rule: GrammarRule;
    meta: any;
    reject: Symbol;
}
export declare type BuiltInPostProcessor = {
    builtin: string;
};
export interface Dictionary<T> {
    [key: string]: T;
}
export declare type JavascriptDirective = {
    body: string;
} | {
    head: string;
};
export interface ConfigDirective {
    config: Dictionary<any>;
}
export interface ImportDirective {
    import: string;
    path?: boolean;
}
export interface ExpressionDefinition {
    name: string;
    rules: GrammarBuilderExpression[];
}
export interface GrammarBuilderExpression {
    symbols: GrammarBuilderSymbol[];
    postprocess?: string | BuiltInPostProcessor;
}
export declare type GrammarBuilderSymbol = GrammarBuilderSymbolRule | GrammarBuilderSymbolRegex | GrammarBuilderSymbolSubexpression | GrammarBuilderSymbolToken | GrammarBuilderSymbolRepeat | GrammarBuilderSymbolLiteral;
export interface GrammarBuilderSymbolRule {
    rule: string;
}
export interface GrammarBuilderSymbolRegex {
    regex: string;
    flags?: string;
}
export interface GrammarBuilderSymbolToken {
    token: string;
}
export interface GrammarBuilderSymbolRepeat {
    expression: GrammarBuilderSymbol;
    repeat: "+" | "*" | "?";
}
export interface GrammarBuilderSymbolLiteral {
    literal: string;
}
export interface GrammarBuilderSymbolSubexpression {
    subexpression: GrammarBuilderExpression[];
}
export declare type ParserAlgorithm = ((language: LanguageDefinition & {
    tokens: TokenQueue;
}, options?: any) => {
    results: any[];
    info?: any;
});
export declare type LanguageDirective = (JavascriptDirective | ImportDirective | ConfigDirective | GrammarDirective | LexerDirective);
export interface GrammarDirective {
    grammar: {
        config?: Dictionary<any>;
        rules: ExpressionDefinition[];
    };
}
export interface LexerDirective {
    lexer: {
        start?: string;
        states: LexerStateDefinition[];
    };
}
interface GrammarRuleSymbolTestable {
    test: (data: any) => boolean;
}
export interface GrammarRule {
    name: string;
    symbols: GrammarRuleSymbol[];
    postprocess?: PostProcessor;
}
export interface GrammarBuilderRule {
    name: string;
    symbols: GrammarBuilderRuleSymbol[];
    postprocess?: BuiltInPostProcessor | string;
}
export declare type GrammarBuilderRuleSymbol = GrammarBuilderSymbolRule | GrammarBuilderSymbolRegex | GrammarBuilderSymbolLiteral | GrammarBuilderSymbolToken;
export declare type GrammarRuleSymbol = string | RegExp | GrammarBuilderSymbolLiteral | GrammarBuilderSymbolToken | GrammarRuleSymbolTestable;
export interface LanguageDefinition {
    lexer?: Lexer | LexerConfig;
    grammar: {
        start: string;
        rules: Dictionary<GrammarRule[]>;
    };
}
export interface TQRestorePoint {
    historyIndex: number;
    offset: number;
}
export interface Lexer {
    next(): LexerToken | undefined;
    feed(chunk?: string, state?: ReturnType<Lexer['state']>): void;
    state(): any;
    flush?(): void;
}
export interface LexerToken {
    type?: string | undefined;
    value: string;
    offset: number;
    line: number;
    column: number;
}
export interface LexerStatus {
    index: number;
    line: number;
    column: number;
    state: string;
}
export interface LexerStateDefinition {
    name: string;
    unmatched?: string;
    default?: string;
    rules: (LexerStateImportRule | LexerStateMatchRule)[];
}
export interface LexerStateImportRule {
    import: string[];
}
export interface LexerStateMatchRule {
    when: string | RegExp;
    type?: string;
    pop?: number | 'all';
    inset?: number;
    goto?: string;
    set?: string;
}
export interface ResolvedStateDefinition {
    name: string;
    unmatched?: string;
    rules: LexerStateMatchRule[];
}
export interface CompiledStateDefinition {
    rules: LexerStateMatchRule[];
    regexp: RegExp;
    unmatched?: LexerStateMatchRule;
}
export interface LexerConfig {
    start?: string;
    states: Dictionary<LexerStateDefinition>;
}
export interface GeneratorState {
    version: string;
    config: Dictionary<string>;
    head: string[];
    body: string[];
    lexer?: {
        start?: string;
        states: LexerStateDefinition[];
    };
    grammar: {
        start: string;
        rules: GrammarBuilderRule[];
        names: {
            [key: string]: number;
        };
    };
}
export {};
