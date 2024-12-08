import { ASTGrammarSymbolLiteral, ASTGrammarSymbolNonTerminal, ASTGrammarSymbolRegex, ASTGrammarSymbolToken, GeneratorGrammarSymbol } from "../../typings/index.js";
import { GeneratorState } from "../state.js";
export declare class CommonGenerator {
    state: GeneratorState;
    constructor(state: GeneratorState);
    static NewLine(indent: number): string;
    static SmartIndent(current: number, increment?: number): string;
    static JSON(obj: string[] | {
        [key: string]: string | (string[]);
    }, indent?: number): string;
    static JSONArray(obj: string[], indent?: number): string;
    static JSONObject(obj: {
        [key: string]: string | (string[]);
    }, indent?: number): string;
    static IsVal(value: any): boolean;
    static SerializeSymbol(s: GeneratorGrammarSymbol): string;
    static SerializeSymbolNonTerminal(s: ASTGrammarSymbolNonTerminal): string;
    static SerializeSymbolRegex(s: ASTGrammarSymbolRegex): string;
    static SerializeSymbolToken(s: ASTGrammarSymbolToken): string;
    static SerializeSymbolLiteral(s: ASTGrammarSymbolLiteral): string;
    static SymbolIsTerminal(s: GeneratorGrammarSymbol): boolean;
}
