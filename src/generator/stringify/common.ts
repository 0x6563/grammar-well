import { ASTGrammarSymbolLiteral, ASTGrammarSymbolNonTerminal, ASTGrammarSymbolRegex, ASTGrammarSymbolToken, GeneratorGrammarSymbol } from "../../typings/index.js";
import { GeneratorState } from "../state.js";

export class CommonGenerator {
    constructor(public state: GeneratorState) { }

    static NewLine(indent: number) {
        return '\n' + ' '.repeat(indent * 4);
    }

    static SmartIndent(current: number, increment = 1) {
        if (current >= 0) {
            return CommonGenerator.NewLine(current + increment);
        }
        return ' ';
    }

    static JSON(obj: string[] | { [key: string]: string | (string[]) }, indent = 0) {
        return Array.isArray(obj) ? CommonGenerator.JSONArray(obj, indent) : CommonGenerator.JSONObject(obj, indent);
    }

    static JSONArray(obj: string[], indent = 0) {
        let r = `[`;
        for (let i = 0; i < obj.length; i++) {
            const value = obj[i];
            r += `${CommonGenerator.SmartIndent(indent)}${value}${(CommonGenerator.IsVal(obj[i + 1]) ? ',' : '')}`;
        }
        r += `${CommonGenerator.SmartIndent(indent, 0)}]`;
        return r;
    }

    static JSONObject(obj: { [key: string]: string | (string[]) }, indent = 0) {
        let r = `{`;
        let seperator = '';
        const prefix = CommonGenerator.SmartIndent(indent);
        const keys = Object.keys(obj).sort();
        for (const k of keys) {
            const v = obj[k];
            if (CommonGenerator.IsVal(v)) {
                const key = /^[a-z_][a-z\d_$]*$/i.test(k) ? k : JSON.stringify(k);
                const value = Array.isArray(v) ? CommonGenerator.JSON(v, indent + 1 || -1) : v;
                r += `${seperator}${prefix}${key}: ${value}`;
                seperator = ','
            }
        }
        r += `${CommonGenerator.SmartIndent(indent, 0)}}`;
        return r;
    }

    static IsVal(value) {
        return typeof value !== 'undefined' && value !== null;
    }

    static SerializeSymbol(s: GeneratorGrammarSymbol) {
        if (typeof s === 'string') {
            return JSON.stringify(s);
        } else if ('rule' in s) {
            return CommonGenerator.SerializeSymbolNonTerminal(s);
        } else if ('regex' in s) {
            return CommonGenerator.SerializeSymbolRegex(s);
        } else if ('token' in s) {
            return CommonGenerator.SerializeSymbolToken(s);
        } else if ('literal' in s) {
            return CommonGenerator.SerializeSymbolLiteral(s);
        } else {
            return JSON.stringify(s);
        }
    }

    static SerializeSymbolNonTerminal(s: ASTGrammarSymbolNonTerminal) {
        return JSON.stringify(s.rule);
    }

    static SerializeSymbolRegex(s: ASTGrammarSymbolRegex) {
        return `/${(new RegExp(s.regex, s.flags)).source}/${s.flags || ''}`;
    }

    static SerializeSymbolToken(s: ASTGrammarSymbolToken) {
        return `{ token: ${JSON.stringify(s.token)} }`;
    }

    static SerializeSymbolLiteral(s: ASTGrammarSymbolLiteral) {
        return `{ literal: ${JSON.stringify(s.literal)} }`;
    }

    static SymbolIsTerminal(s: GeneratorGrammarSymbol) {
        return !(typeof s === 'string' || 'rule' in s);
    }

}