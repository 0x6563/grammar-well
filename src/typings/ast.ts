import { Dictionary } from "./common.js";

export type AST = ASTDirectives[];

export type ASTJavascriptLifecycleLiteral = {
    lifecycle: string;
    path?: boolean;
    js: ASTJavaScriptLiteral;
}
export type ASTJavaScriptLiteral = { js: string }
export type ASTJavaScriptTemplate = { template: string }

/**
 * Only available during the generator phase
 *
 * @export
 * @interface ASTJavaScriptBuiltin
 */
export interface ASTJavaScriptBuiltin { builtin: string }

export interface ASTImport {
    import: string;
    path?: boolean;
    alias?: string;
}

export interface ASTConfig {
    config: Dictionary<any>;
}

export interface ASTGrammar {
    grammar: {
        config?: Dictionary<any>;
        rules: ASTGrammarProduction[];
    }
}

export interface ASTLexer {
    lexer: ASTLexerConfig;
}
export interface ASTLexerConfig {
    start?: string;
    states: { name: string, state: (ASTLexerState | ASTLexerStateSpan) }[];
};
export interface ASTGrammarProduction {
    name: string;
    expressions: ASTGrammarProductionRule[];
    postprocess?: ASTJavaScriptLiteral | ASTJavaScriptTemplate | ASTJavaScriptBuiltin;
}

export interface ASTGrammarProductionRule {
    symbols: ASTGrammarSymbol[];
    postprocess?: ASTJavaScriptLiteral | ASTJavaScriptTemplate | ASTJavaScriptBuiltin;
}

export type ASTGrammarSymbol = ASTGrammarSymbolAlias & (ASTGrammarSymbolNonTerminal | ASTGrammarSymbolRegex | ASTGrammarSymbolToken | ASTGrammarSymbolLiteral | ASTGrammarSymbolRepeat | ASTGrammarSymbolGroup);
export type ASTGrammarSymbolAlias = { alias?: string };

export interface ASTGrammarSymbolGroup {
    subexpression: ASTGrammarProductionRule[];
}

export interface ASTGrammarSymbolRepeat {
    expression: ASTGrammarSymbol;
    repeat: "+" | "*" | "?";
}

export interface ASTGrammarSymbolNonTerminal {
    rule: string;
}

export interface ASTGrammarSymbolRegex {
    regex: string;
    flags?: string;
    quote?: string;
}

export interface ASTGrammarSymbolToken {
    token: string;
}

export interface ASTGrammarSymbolLiteral {
    literal: string;
    insensitive?: boolean;
}

export type ASTDirectives = (ASTJavascriptLifecycleLiteral | ASTImport | ASTConfig | ASTGrammar | ASTLexer);

export interface ASTLexerState {
    unmatched?: ASTLexerStateNonMatchRule;
    default?: ASTLexerStateMatchRule;
    rules: (ASTLexerStateImportRule | ASTLexerStateMatchRule | ASTLexerStateSpan)[];
}

export interface ASTLexerStateSpan {
    span: { name: string, state: (ASTLexerState) }[];
}

export interface ASTLexerStateImportRule {
    import: string[];

    pop?: number | 'all';
    inset?: number;
    goto?: string;
    set?: string;
    stay?: boolean;
}

export interface ASTLexerStateMatchRule {
    when: string | ASTGrammarSymbolRegex;
    type?: string;
    tag?: string[];
    before?: boolean;
    skip?: boolean;
    highlight?: string;
    open?: string;
    close?: string;
    embed?: string;
    unembed?: boolean;

    pop?: number | 'all';
    stay?: true;
    inset?: number;
    goto?: string;
    set?: string;
}

export interface ASTLexerStateNonMatchRule {
    type?: string;
    tag?: string[];
    before?: undefined;
    skip?: undefined;
    highlight?: string;
    open?: string;
    close?: string;
    embed?: string;
    unembed?: boolean;

    pop?: number | 'all';
    inset?: number;
    goto?: string;
    set?: string;
}

export type StateList = { name: string, state: (ASTLexerState | ASTLexerStateSpan) }[];