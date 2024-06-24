import { GeneratorLexerConfig } from "../../typings/index.js";
export declare class LexerArtifact {
    private lexer;
    private resolved;
    private resolving;
    constructor(lexer: GeneratorLexerConfig);
    output(depth?: number): string;
    private lexerConfigStates;
    private lexerConfigStateRules;
    private lexerConfigStateRule;
    private resolveStates;
    private resolveRuleImports;
}
