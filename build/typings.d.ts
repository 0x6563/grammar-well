import { TokenQueue } from "./lexers/token-queue";
export interface Dictionary<T> {
    [key: string]: T;
}
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
export interface GrammarBuilderContext {
    alreadyCompiled: Set<string>;
    resolver: ImportResolver;
    uuids: Dictionary<number>;
}
export interface ImportResolver {
    path(path: string): string;
    body(path: string): Promise<string>;
}
export interface ImportResolverConstructor {
    new (basePath: string): ImportResolver;
}
export declare type PostProcessor = (payload: PostProcessorPayload) => any;
interface PostProcessorPayload {
    data: any[];
    rule: GrammarRule;
    meta: any;
    reject: Symbol;
}
export declare type JavascriptDirective = {
    body: GrammarTypeJS;
} | {
    head: GrammarTypeJS;
};
export interface ImportDirective {
    import: string;
    path?: boolean;
}
export interface ConfigDirective {
    config: Dictionary<any>;
}
export interface GrammarDirective {
    grammar: {
        config?: Dictionary<any>;
        rules: GrammarBuilderRule[];
    };
}
export interface LexerDirective {
    lexer: {
        start?: string;
        states: LexerStateDefinition[];
    };
}
export interface GrammarBuilderRule {
    name: string;
    expressions: GrammarBuilderExpression[];
    postprocess?: GrammarTypeJS | GrammarTypeBuiltIn | GrammarTypeTemplate;
}
export interface GrammarBuilderExpression {
    symbols: GrammarBuilderSymbol[];
    postprocess?: GrammarTypeJS | GrammarTypeBuiltIn | GrammarTypeTemplate;
}
export declare type GrammarBuilderSymbol = GrammarTypeRule | GrammarTypeRegex | GrammarTypeToken | GrammarTypeLiteral | GrammarBuilderSymbolRepeat | GrammarBuilderSymbolSubexpression;
export interface GrammarBuilderSymbolSubexpression {
    subexpression: GrammarBuilderExpression[];
}
export interface GrammarBuilderSymbolRepeat {
    expression: GrammarBuilderSymbol;
    repeat: "+" | "*" | "?";
}
export interface GrammarTypeRule {
    rule: string;
}
export interface GrammarTypeRegex {
    regex: string;
    flags?: string;
}
export interface GrammarTypeToken {
    token: string;
}
export interface GrammarTypeLiteral {
    literal: string;
    insensitive?: boolean;
}
export declare type GrammarTypeBuiltIn = {
    builtin: string;
};
export declare type GrammarTypeTemplate = {
    template: string;
};
export declare type GrammarTypeJS = {
    js: string;
};
export declare type ParserAlgorithm = ((language: LanguageDefinition & {
    tokens: TokenQueue;
}, options?: any) => {
    results: any[];
    info?: any;
});
export declare type LanguageDirective = (JavascriptDirective | ImportDirective | ConfigDirective | GrammarDirective | LexerDirective);
declare type GrammarRuleSymbolFunction = (data: LexerToken) => boolean;
export interface GrammarRule {
    name: string;
    symbols: GrammarRuleSymbol[];
    postprocess?: PostProcessor;
}
export declare type GrammarRuleSymbol = string | RegExp | GrammarTypeLiteral | GrammarTypeToken | GrammarRuleSymbolFunction;
export interface GeneratorGrammarRule {
    name: string;
    symbols: GeneratorGrammarSymbol[];
    postprocess?: GrammarTypeTemplate | GrammarTypeBuiltIn | GrammarTypeJS;
}
export declare type GeneratorGrammarSymbol = {
    alias?: string;
} & (GrammarTypeRule | GrammarTypeRegex | GrammarTypeLiteral | GrammarTypeToken | GrammarTypeJS);
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
    tag?: Set<String>;
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
    tag?: string[];
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
    regexp: RegExp;
    unmatched?: LexerStateMatchRule;
    rules: LexerStateMatchRule[];
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
    lexer?: LexerConfig;
    grammar: {
        start: string;
        rules: Dictionary<GeneratorGrammarRule[]>;
        uuids: {
            [key: string]: number;
        };
    };
}
export {};
