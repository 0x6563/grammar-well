import { Dictionary } from "./common";
import { ASTGrammarSymbolLiteral, ASTGrammarSymbolNonTerminal, ASTGrammarSymbolRegex, ASTGrammarSymbolToken, ASTJavaScriptBuiltin, ASTJavaScriptLiteral, ASTJavaScriptTemplate, ASTLexerState } from "./ast";
import { ImportResolver, ImportResolverConstructor, TemplateFormat } from ".";
export interface GeneratorOptions {
    version?: string;
    noscript?: boolean;
    basedir?: string;
    resolver?: ImportResolverConstructor | ImportResolver;
    exportName?: string;
    template?: TemplateFormat;
    overrides?: Dictionary<string>;
}
export interface GeneratorContext {
    imported: Set<string>;
    resolver: ImportResolver;
    uuids: Dictionary<number>;
}
export interface GeneratorLexerConfig {
    start?: string;
    states: Dictionary<ASTLexerState>;
}
export interface GeneratorGrammarProductionRule {
    name: string;
    symbols: GeneratorGrammarSymbol[];
    postprocess?: ASTJavaScriptTemplate | ASTJavaScriptLiteral | ASTJavaScriptBuiltin;
}
export type GeneratorGrammarSymbol = {
    alias?: string;
} & (ASTGrammarSymbolNonTerminal | ASTGrammarSymbolRegex | ASTGrammarSymbolLiteral | ASTGrammarSymbolToken);
