import { GeneratorGrammarProductionRule, GeneratorLexerConfig, GeneratorLexerState, GeneratorStateGrammar } from "../typings/index.js";
export declare class GeneratorState {
    grammar?: GeneratorStateGrammar;
    lexer?: GeneratorLexerConfig;
    lifecycle: {
        import?: string[];
        new?: string[];
        token?: string[];
    };
    config: {};
    version: string;
    merge(state: GeneratorState): void;
    grammarUUID(name: string): string;
    initializeGrammar(): void;
    addGrammarRule(rule: GeneratorGrammarProductionRule): void;
    initializeLexer(): void;
    addLexerState(name: string, state?: GeneratorLexerState): void;
    addLifecycle(lifecycle: string, literal: string | string[]): void;
    export(): {
        grammar: GeneratorStateGrammar;
        lexer: GeneratorLexerConfig;
        lifecycle: {
            import?: string[];
            new?: string[];
            token?: string[];
        };
        config: {};
        version: string;
    };
}
