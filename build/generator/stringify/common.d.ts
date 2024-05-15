import { GeneratorGrammarSymbol } from "../../typings";
import { GeneratorState } from "../state";
export declare class CommonGenerator {
    state: GeneratorState;
    constructor(state: GeneratorState);
    static NewLine(indent: number): string;
    static SmartIndent(current: number, increment?: number): string;
    static JSON(obj: string[] | {
        [key: string]: string | (string[]);
    }, indent?: number): string;
    static IsVal(value: any): boolean;
    static SerializeSymbol(s: GeneratorGrammarSymbol): string;
    static SymbolIsTerminal(s: GeneratorGrammarSymbol): boolean;
}
