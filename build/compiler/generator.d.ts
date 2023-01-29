import { GeneratorState, GeneratorGrammarRule, LexerStateDefinition } from "../typings";
export declare class Generator {
    state: GeneratorState;
    serializeHead(): string;
    serializeBody(): string;
    serializeLanguage(depth?: number): string;
    merge(state: GeneratorState): void;
    grammarUUID(name: string): string;
    addGrammarRule(rule: GeneratorGrammarRule): void;
    addLexerState(state: LexerStateDefinition): void;
    private serializeGrammar;
    private serializeGrammarRules;
    private serializeSymbol;
    private serializeGrammarRule;
    private serializePostProcess;
    private templatePostProcess;
    private serializeLexerConfig;
    private serializeLexerConfigStates;
    private serializeLexerConfigStateRules;
    private newLine;
    private pretty;
    private isVal;
}
