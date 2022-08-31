export type PostProcessor = (payload: PostProcessorPayload) => any;

interface PostProcessorPayload {
    data: any[];
    reference: number;
    dot: number;
    name: string;
    reject: Symbol;
}

export type BuiltInPostProcessor = { builtin: string };

export interface Dictionary<T> {
    [key: string]: T;
}

export type PostProcessorResult = ExpressionDefinition
    | IncludeDefinition
    | ConfigDefinition
    | JavascriptDefinition
    | MacroDefinition

    | TokenLiteral
    | SubExpression
    | LexerTokenMatch
    | EBNFModified
    | MixIn
    | null;


export interface MacroDefinition {
    macro: string;
    args: string[];
    exprs: Expression[];
}
export type JavascriptDefinition = {
    body: string;
} | { head: string }
export interface ConfigDefinition {
    config: string;
    value: string;
}
export interface IncludeDefinition {
    include: string;
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
export type ExpressionToken = string | MixIn | MacroCall | SubExpression | LexerTokenMatch | EBNFModified | TokenLiteral;

export interface MacroCall {
    macrocall: string;
    args: ExpressionToken[];
}
export interface LexerTokenMatch {
    token: string;
}
export interface MixIn {
    mixin: string;
}
export interface EBNFModified {
    ebnf: ExpressionToken;
    modifier: ":+" | ":*" | ":?";
}

export interface TokenLiteral {
    literal: string;
}

export interface SubExpression {
    subexpression: Expression[];
}

export interface ProductionRule {
    body: any;
    builtin: any;
    include: any;
    macro: any;
    args: any;
    exprs: any;
    config: any;
    value: any;
    rules: any;
    name: any;
}

export type RuleDefinition = (JavascriptDefinition | IncludeDefinition | MacroDefinition | ConfigDefinition | ExpressionDefinition);
export type RuleDefinitionList = (JavascriptDefinition | IncludeDefinition | MacroDefinition | ConfigDefinition | ExpressionDefinition)[];


export type RuleSymbol = string | RegExp | RuleSymbolToken | RuleSymbolLexerToken | LexerTokenMatch | RuleSymbolTestable;

interface RuleSymbolToken {
    literal: any;
}

interface RuleSymbolTestable {
    test: (data: any) => boolean;
}

interface RuleSymbolLexerToken {
    type: string;
    value: string;
    text: string;
}


export interface GrammarBuilderRule {
    name: string;
    symbols: RuleSymbol[];
    postprocess?: BuiltInPostProcessor | string;
}

export interface Rule {
    name: string;
    symbols: RuleSymbol[];
    postprocess?: PostProcessor;
}

export interface ParserAlgorithm {
    results: any[];
    feed(path: string): void;
}

export interface ParserConstructor {
    new(grammar: PrecompiledGrammar, options?: any): ParserAlgorithm;
}

export interface PrecompiledGrammar {
    lexer?: Lexer;
    start: string;
    rules: Rule[];
    map?: { [key: string]: Rule[] };
}

export interface LexerState {
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