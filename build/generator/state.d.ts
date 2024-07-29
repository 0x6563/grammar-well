import { GeneratorGrammarProductionRule, GeneratorLexerConfig, GeneratorLexerState, GeneratorStateGrammar } from "../typings/index.js";
export declare class GeneratorState {
    grammar?: GeneratorStateGrammar;
    lexer?: GeneratorLexerConfig;
    head: string[];
    body: string[];
    config: {};
    version: string;
    merge(state: GeneratorState): void;
    grammarUUID(name: string): string;
    initializeGrammar(): void;
    addGrammarRule(rule: GeneratorGrammarProductionRule): void;
    initializeLexer(): void;
    addLexerState(name: string, state?: GeneratorLexerState): void;
    export(): {
        grammar: GeneratorStateGrammar;
        lexer: GeneratorLexerConfig;
        head: string[];
        body: string[];
        config: {};
        version: string;
    };
}
