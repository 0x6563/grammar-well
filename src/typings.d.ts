import { Lexer } from "./lib/lexer";
import { EarleyParser } from "./parsers/earley/parser";

export type PostProcessor = (data: any[], location: number, reject: typeof EarleyParser.fail) => any;
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
    | LexerToken
    | EBNFModified
    | MixIn
    | null;


export interface MacroDefinition {
    macro: string;
    args: string[];
    exprs: Expression[];
}
export interface JavascriptDefinition {
    body: string;
}
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
    postprocess?: PostProcessor | BuiltInPostProcessor
}
export type ExpressionToken = string | MixIn | MacroCall | SubExpression | LexerToken | EBNFModified | TokenLiteral;

export interface MacroCall {
    macrocall: string;
    args: ExpressionToken[];
}
export interface LexerToken {
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


export type RuleSymbol = string | RegExp | RuleSymbolToken | RuleSymbolLexerToken | RuleSymbolTest | LexerToken;

interface RuleSymbolToken {
    literal: any;
}

interface RuleSymbolLexerToken {
    type: string;
    value: string;
    text: string;
}

interface RuleSymbolTest {///?????
    test: string;
}
export interface Rule {
    name: string;
    symbols: RuleSymbol[];
    postprocess: PostProcessor | BuiltInPostProcessor | string;
}

export interface Parser {
    results: any[];
    feed(path: string): void;
}

export interface ParserConstructor {
    new(grammar: PrecompiledGrammar, options?: any): Parser;
}

export interface PrecompiledGrammar {
    lexer?: Lexer;
    start: string;
    rules: Rule[];
    map?: Dictionary<Rule[]>;
}