import type { GeneratorLexerConfig } from "../../typings/index.ts";
export declare class LexerArtifact {
    private resolved;
    private resolving;
    private lexer;
    constructor(lexer: GeneratorLexerConfig);
    output(depth?: number): string;
    private lexerConfigStates;
    private lexerConfigStateRules;
    private lexerConfigStateRule;
    private resolveStates;
    private resolveRuleImports;
}
