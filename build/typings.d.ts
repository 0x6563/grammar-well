import { TokenBuffer } from "./lexers/token-buffer";
import { ParserUtility } from "./parser/parser";
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
    template?: TemplateFormat;
    overrides?: Dictionary<string>;
}
export type TemplateFormat = '_default' | 'object' | 'json' | 'js' | 'javascript' | 'module' | 'esmodule' | 'esm' | 'ts' | 'typescript';
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
export type PostProcessor = (payload: PostProcessorPayload) => any;
interface PostProcessorPayload {
    data: any[];
    rule: GrammarRule;
    meta: any;
}
export type JavascriptDirective = {
    body: GrammarTypeJS;
} | {
    head: GrammarTypeJS;
};
export interface ImportDirective {
    import: string;
    path?: boolean;
    alias?: string;
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
export type GrammarBuilderSymbol = GrammarTypeRule | GrammarTypeRegex | GrammarTypeToken | GrammarTypeLiteral | GrammarBuilderSymbolRepeat | GrammarBuilderSymbolSubexpression;
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
export type GrammarTypeBuiltIn = {
    builtin: string;
};
export type GrammarTypeTemplate = {
    template: string;
};
export type GrammarTypeJS = {
    js: string;
};
export type ParserAlgorithm = ((language: LanguageDefinition & {
    tokens: TokenBuffer;
    utility: ParserUtility;
}, options?: any) => {
    results: any[];
    info?: any;
});
export type LanguageDirective = (JavascriptDirective | ImportDirective | ConfigDirective | GrammarDirective | LexerDirective);
type GrammarRuleSymbolFunction = (data: LexerToken) => boolean;
export interface GrammarRule {
    name: string;
    symbols: GrammarRuleSymbol[];
    postprocess?: PostProcessor;
}
export type GrammarRuleSymbol = string | RegExp | GrammarTypeLiteral | GrammarTypeToken | GrammarRuleSymbolFunction;
export interface GeneratorGrammarRule {
    name: string;
    symbols: GeneratorGrammarSymbol[];
    postprocess?: GrammarTypeTemplate | GrammarTypeBuiltIn | GrammarTypeJS;
}
export type GeneratorGrammarSymbol = {
    alias?: string;
} & (GrammarTypeRule | GrammarTypeRegex | GrammarTypeLiteral | GrammarTypeToken);
export interface LanguageDefinition {
    lexer?: Lexer | LexerConfig;
    grammar: {
        start: string;
        rules: Dictionary<GrammarRule[]>;
    };
    lr?: {
        k: number;
        table: Dictionary<LRState>;
    };
}
export interface LRState {
    actions: Next[];
    goto: {
        [key: string]: string;
    };
    reduce?: GrammarRule;
    isFinal: boolean;
}
type Next = {
    symbol: GrammarRuleSymbol;
    next: string;
};
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
    tag?: Set<string>;
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
    before?: true;
    highlight?: string;
    embed?: string;
    unembed?: boolean;
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
        config: {
            postprocessorDefault?: GrammarTypeJS | GrammarTypeTemplate;
            postprocessorOverride?: GrammarTypeJS | GrammarTypeTemplate;
        };
        rules: Dictionary<GeneratorGrammarRule[]>;
        uuids: {
            [key: string]: number;
        };
    };
}
export {};
