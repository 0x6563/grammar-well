import { Dictionary, GeneratorGrammarRule, GrammarTypeJS, GrammarTypeTemplate, LexerConfig, LexerStateDefinition } from "../typings";
export declare class GeneratorState {
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
    lexer: LexerConfig | undefined;
    head: string[];
    body: string[];
    config: Dictionary<string>;
    version: string;
    merge(state: GeneratorState): void;
    grammarUUID(name: string): string;
    addGrammarRule(rule: GeneratorGrammarRule): void;
    addLexerState(state: LexerStateDefinition): void;
    export(): {
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
        lexer: LexerConfig;
        head: string[];
        body: string[];
        config: Dictionary<string>;
        version: string;
    };
}
