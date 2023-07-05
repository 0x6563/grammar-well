import { Dictionary, GeneratorState, GeneratorGrammarRule, GeneratorGrammarSymbol, LexerStateDefinition } from "../../typings";
export declare class Generator {
    state: GeneratorState;
    serializeHead(): string;
    serializeBody(): string;
    serializeLanguage(depth?: number): string;
    merge(state: GeneratorState): void;
    grammarUUID(name: string): string;
    addGrammarRule(rule: GeneratorGrammarRule): void;
    addLexerState(state: LexerStateDefinition): void;
    serializePostProcess(postprocess: GeneratorGrammarRule['postprocess'], alias: Dictionary<number>): any;
    private templatePostProcess;
    private serializeLexerConfig;
    private serializeLexerConfigStates;
    private serializeLexerConfigStateRules;
    serializeGrammarRule(rule: GeneratorGrammarRule): string;
    static NewLine(depth: number): string;
    static Pretty(obj: string[] | {
        [key: string]: string | (string[]);
    }, depth?: number): string;
    static IsVal(value: any): boolean;
    static SerializeSymbol(s: GeneratorGrammarSymbol): string;
    static SymbolIsTerminal(s: GeneratorGrammarSymbol): boolean;
}
