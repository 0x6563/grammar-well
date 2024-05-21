import { ASTJavaScriptBuiltin, ASTJavaScriptLiteral, ASTLexerState, Dictionary, GeneratorGrammarProductionRule, GeneratorLexerConfig } from "../typings";
export declare class GeneratorState {
    grammar: {
        start: string;
        config: {
            postprocessorDefault?: ASTJavaScriptLiteral | ASTJavaScriptBuiltin;
            postprocessorOverride?: ASTJavaScriptLiteral | ASTJavaScriptBuiltin;
        };
        rules: Dictionary<GeneratorGrammarProductionRule[]>;
        uuids: {
            [key: string]: number;
        };
    };
    lexer: GeneratorLexerConfig | undefined;
    head: string[];
    body: string[];
    config: Dictionary<string>;
    version: string;
    merge(state: GeneratorState): void;
    grammarUUID(name: string): string;
    addGrammarRule(rule: GeneratorGrammarProductionRule): void;
    addLexerState(state: ASTLexerState): void;
    export(): {
        grammar: {
            start: string;
            config: {
                postprocessorDefault?: ASTJavaScriptLiteral | ASTJavaScriptBuiltin;
                postprocessorOverride?: ASTJavaScriptLiteral | ASTJavaScriptBuiltin;
            };
            rules: Dictionary<GeneratorGrammarProductionRule[]>;
            uuids: {
                [key: string]: number;
            };
        };
        lexer: GeneratorLexerConfig;
        head: string[];
        body: string[];
        config: Dictionary<string>;
        version: string;
    };
}
