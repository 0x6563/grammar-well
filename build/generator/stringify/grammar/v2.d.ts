import { ASTConfig, GeneratorGrammarSymbol, ASTGrammarProduction, ASTGrammarSymbol, ASTGrammar, ASTImport, ASTDirectives, ASTLexer, ASTLexerStateImportRule, ASTLexerStateMatchRule, ASTLexerStateNonMatchRule } from "../../../typings";
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
    formatLexerStateRule(rule: ASTLexerStateMatchRule | ASTLexerStateNonMatchRule | ASTLexerStateImportRule): string;
    formatWhen(when: string | {
        regex: string;
        flags: string;
    }): string;
    formatKV(obj: {
        [key: string]: any;
    }, depth?: number): string;
    appendSection(label: string, body: string): void;
    indent(depth: number, content: string): string;
}
