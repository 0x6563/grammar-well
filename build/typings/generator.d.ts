import { GeneratorState } from "../generator/state.ts";
import type { ASTGrammarSymbolLiteral, ASTGrammarSymbolNonTerminal, ASTGrammarSymbolRegex, ASTGrammarSymbolToken, ASTJavaScriptBuiltin, ASTJavaScriptLiteral, ASTJavaScriptTemplate, ASTLexerStateImportRule, ASTLexerStateMatchRule, ASTLexerStateNonMatchRule } from "./ast.ts";
import type { Dictionary } from "./common.ts";
import type { ImportResolver, ImportResolverConstructor } from "./index.ts";
export type GenerateOptions = GeneratorOptions & {
    output?: GeneratorOutputOptions;
};
export interface GeneratorOptions {
    basedir?: string;
    resolver?: ImportResolverConstructor | ImportResolver;
}
export interface GeneratorOutputOptions {
    artifacts?: {
        lexer?: boolean;
        grammar?: boolean;
        [key: string]: boolean;
    };
    format?: GeneratorExportFormat;
    noscript?: boolean;
    name?: string;
}
export type GeneratorExportFormat = 'object' | 'json' | 'cjs' | 'commonjs' | 'js' | 'javascript' | 'module' | 'esmodule' | 'esm' | 'ts' | 'typescript';
export interface GeneratorContext {
    imported: Set<string>;
    resolver: ImportResolver;
    state: GeneratorState;
}
export interface GeneratorStateGrammar {
    start: string;
    config: {
        algorithm?: 'earley' | 'lr0' | 'cyk';
        postprocessorDefault?: ASTJavaScriptLiteral | ASTJavaScriptBuiltin;
        postprocessorOverride?: ASTJavaScriptLiteral | ASTJavaScriptBuiltin;
    };
    rules: Dictionary<GeneratorGrammarProductionRule[]>;
    uuids: {
        [key: string]: number;
    };
}
export interface GeneratorLexerConfig {
    start?: string;
    states: Dictionary<GeneratorLexerState>;
}
export interface GeneratorLexerState {
    unmatched?: ASTLexerStateNonMatchRule;
    rules: (ASTLexerStateImportRule | ASTLexerStateMatchRule)[];
}
export interface GeneratorGrammarProductionRule {
    name: string;
    symbols: GeneratorGrammarSymbol[];
    postprocess?: ASTJavaScriptTemplate | ASTJavaScriptLiteral | ASTJavaScriptBuiltin;
}
export type GeneratorGrammarSymbol = {
    alias?: string;
} & (ASTGrammarSymbolNonTerminal | ASTGrammarSymbolRegex | ASTGrammarSymbolLiteral | ASTGrammarSymbolToken);
