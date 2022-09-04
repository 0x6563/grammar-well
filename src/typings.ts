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

export type OutputFormat = '_default' | 'object' | 'json' | 'js' | 'javascript' | 'module' | 'esmodule' | 'ts' | 'typescript'

export interface CompilerState {
    alreadycompiled: Set<string>;
    resolver: ImportResolver;
}

export type PostProcessor = (payload: PostProcessorPayload) => any;

export interface ImportResolver {
    path(path: string): string;
    body(path: string): Promise<string>;
}

export interface ImportResolverConstructor {
    new(basePath: string): ImportResolver;
}

interface PostProcessorPayload {
    data: any[];
    rule: GrammarRule;
    reference: number;
    dot: number;
    reject: Symbol;
}

export type BuiltInPostProcessor = { builtin: string };

export interface Dictionary<T> {
    [key: string]: T;
}

export type JavascriptDirective = { body: string; } | { head: string }

export interface ConfigDirective {
    config: Dictionary<any>;
}
export interface ImportDirective {
    import: string;
    builtin?: boolean;
}
export interface ExpressionDefinition {
    name: string;
    rules: Expression[];
}
export interface Expression {
    tokens: ExpressionToken[];
    postprocess?: string | BuiltInPostProcessor;
}
export type ExpressionToken = string | SubExpression | LexerTokenMatch | EBNFModified | TokenLiteral;

export interface LexerTokenMatch {
    token: string;
}
export interface EBNFModified {
    ebnf: ExpressionToken;
    modifier: "+" | "*" | "?";
}

export interface TokenLiteral {
    literal: string;
}

export interface SubExpression {
    subexpression: Expression[];
}

export type LanguageDirective = (JavascriptDirective | ImportDirective | ConfigDirective | GrammarDirective | LexerDirective);

export interface GrammarDirective {
    grammar: {
        rules: ExpressionDefinition[];
    }
}
export interface LexerDirective {
    lexer: LexerConfig
}

export type GrammarRuleSymbol = string | RegExp | GrammarRuleSymbolToken | GrammarRuleSymbolLexerToken | GrammarRuleSymbolTestable | LexerTokenMatch;

interface GrammarRuleSymbolToken {
    literal: any;
}

interface GrammarRuleSymbolTestable {
    test: (data: any) => boolean;
}

interface GrammarRuleSymbolLexerToken {
    type: string;
}

export interface GrammarBuilderRule {
    name: string;
    symbols: GrammarRuleSymbol[];
    postprocess?: BuiltInPostProcessor | string;
}

export interface GrammarRule {
    name: string;
    symbols: GrammarRuleSymbol[];
    postprocess?: PostProcessor;
}

export interface ParserAlgorithm {
    results: any[];
    feed(path: string): void;
}

export interface ParserAlgorithmConstructor {
    new(language: LanguageDefinition & { tokenQueue: TokenQueue }, options?: any): ParserAlgorithm;
}

export interface LanguageDefinition {
    lexer?: Lexer | LexerConfig;
    grammar: {
        start: string;
        rules: GrammarRule[];
    }
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
    import: string[]
}
export interface LexerStateMatchRule {
    when: string | RegExp
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
    start?: string
    states: LexerStateDefinition[];
}

export interface GeneratorState {
    version: string;
    config: Dictionary<string>;
    head: string[];
    body: string[];
    lexer?: LexerConfig;
    grammar: {
        start: string;
        rules: GrammarBuilderRule[],
        names: { [key: string]: number }
    }
}
