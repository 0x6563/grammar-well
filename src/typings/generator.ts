import { ImportResolver, ImportResolverConstructor } from ".";
import { ASTGrammarSymbolLiteral, ASTGrammarSymbolNonTerminal, ASTGrammarSymbolRegex, ASTGrammarSymbolToken, ASTJavaScriptBuiltin, ASTJavaScriptLiteral, ASTJavaScriptTemplate, ASTLexerState } from "./ast";
import { Dictionary } from "./common";

export interface GeneratorOptions {
    version?: string;
    noscript?: boolean;
    basedir?: string;
    resolver?: ImportResolverConstructor | ImportResolver;
    exportName?: string;
    template?: GeneratorTemplateFormat;
    overrides?: Dictionary<string>;
}

export type GeneratorTemplateFormat = '_default' | 'object' | 'json' | 'js' | 'javascript' | 'module' | 'esmodule' | 'esm' | 'ts' | 'typescript'

export interface GeneratorContext {
    imported: Set<string>;
    resolver: ImportResolver;
    uuids: Dictionary<number>;
}

export interface GeneratorLexerConfig {
    start?: string
    states: Dictionary<ASTLexerState>;
}

export interface GeneratorGrammarProductionRule {
    name: string;
    symbols: GeneratorGrammarSymbol[];
    postprocess?: ASTJavaScriptTemplate | ASTJavaScriptLiteral | ASTJavaScriptBuiltin;
}

export type GeneratorGrammarSymbol = { alias?: string } & (ASTGrammarSymbolNonTerminal | ASTGrammarSymbolRegex | ASTGrammarSymbolLiteral | ASTGrammarSymbolToken);
