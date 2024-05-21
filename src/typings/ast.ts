import { Dictionary } from "./common";

export type AST = ASTDirectives[];

export type ASTJavaScriptSection = { body: ASTJavaScriptLiteral; } | { head: ASTJavaScriptLiteral }
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
    states: ASTLexerState[];
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
    flags?: string
}

export interface ASTGrammarSymbolToken {
    token: string;
}

export interface ASTGrammarSymbolLiteral {
    literal: string;
    insensitive?: boolean;
}

export type ASTDirectives = (ASTJavaScriptSection | ASTImport | ASTConfig | ASTGrammar | ASTLexer);

export interface ASTLexerState {
    name: string;
    unmatched?: ASTLexerStateNonMatchRule;
    default?: ASTLexerStateMatchRule;
    rules: (ASTLexerStateImportRule | ASTLexerStateMatchRule)[];
}

export interface ASTLexerStateImportRule {
    import: string[]
}

export interface ASTLexerStateMatchRule {
    when: string | ASTGrammarSymbolRegex;
    type?: string;
    tag?: string[];
    pop?: number | 'all';
    before?: boolean;
    highlight?: string;
    open?: string;
    close?: string;
    embed?: string;
    unembed?: boolean;
    inset?: number;
    goto?: string;
    set?: string;
}

export interface ASTLexerStateNonMatchRule {
    type?: string;
    tag?: string[];
    pop?: number | 'all';
    before?: undefined;
    highlight?: string;
    open?: string;
    close?: string;
    embed?: string;
    unembed?: boolean;
    inset?: number;
    goto?: string;
    set?: string;
}
