import { GeneratorState } from "../generator/state.js";
import { ASTGrammarSymbolLiteral, ASTGrammarSymbolNonTerminal, ASTGrammarSymbolRegex, ASTGrammarSymbolToken, ASTJavaScriptBuiltin, ASTJavaScriptLiteral, ASTJavaScriptTemplate, ASTLexerStateImportRule, ASTLexerStateMatchRule, ASTLexerStateNonMatchRule } from "./ast.js";
import { Dictionary } from "./common.js";
import { ImportResolver, ImportResolverConstructor } from "./index.js";
export type GenerateOptions = GeneratorOptions & {
    output?: GeneratorOutputOptions;
};
export interface GeneratorOptions {
    version?: string;
    basedir?: string;
    resolver?: ImportResolverConstructor | ImportResolver;
    overrides?: Dictionary<string>;
}
export interface GeneratorOutputOptions {
    artifacts?: {
        lexer?: boolean;
        grammar?: boolean;
        [key: string]: boolean;
    };
    parser?: boolean;
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
