import { ASTConfig, ASTDirectives, ASTGrammar, ASTGrammarProduction, ASTGrammarSymbol, ASTImport, ASTLexer, ASTLexerState, ASTLexerStateImportRule, ASTLexerStateMatchRule, ASTLexerStateNonMatchRule, GeneratorGrammarSymbol } from "../../../typings/index.js";
export declare class V2GrammarString {
    source: string;
    append(directives: ASTDirectives | (ASTDirectives[])): void;
    appendImportDirective(directive: ASTImport): void;
    appendConfigDirective(directive: ASTConfig): void;
    appendGrammarDirective(directive: ASTGrammar): void;
    formatGrammarRule(rule: ASTGrammarProduction): string;
    formatSymbols(exp: GeneratorGrammarSymbol[]): any;
    formatSymbol(exp: ASTGrammarSymbol | GeneratorGrammarSymbol | string): any;
    formatPostProcess(postProcess: ASTGrammarProduction['postprocess']): string;
    appendLexerDirective(directive: ASTLexer): void;
    formatLexerState(name: string, state: ASTLexerState, depth?: number): string;
    formatLexerStateRule(rule: ASTLexerStateMatchRule | ASTLexerStateNonMatchRule | ASTLexerStateImportRule): string;
    formatKV(obj: {
        [key: string]: any;
    }, depth?: number): string;
    appendSection(label: string, body: string): void;
    indent(depth: number, content: string): string;
}
