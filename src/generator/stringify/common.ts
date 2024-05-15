import { GeneratorGrammarSymbol } from "../../typings";
import { GeneratorState } from "../state";

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
        if (Array.isArray(obj)) {
            let r = `[`;
            for (let i = 0; i < obj.length; i++) {
                const value = obj[i];
                r += `${CommonGenerator.SmartIndent(indent)}${value}${(CommonGenerator.IsVal(obj[i + 1]) ? ',' : '')}`;
            }
            r += `${CommonGenerator.SmartIndent(indent, 0)}]`;
            return r;
        }

        let r = `{`;
        let seperator = '';
        const prefix = CommonGenerator.SmartIndent(indent);
        for (const k in obj) {
            const v = obj[k];
            if (CommonGenerator.IsVal(v)) {
                const key = /[a-z_][a-z\d_$]*/i.test(k) ? k : JSON.stringify(k);
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
            return JSON.stringify(s.rule);
        } else if ('regex' in s) {
            return `/${s.regex}/${s.flags || ''}`;
        } else if ('token' in s) {
            return `{ token: ${JSON.stringify(s.token)} }`;
        } else if ('literal' in s) {
            return `{ literal: ${JSON.stringify(s.literal)} }`;
        } else {
            return JSON.stringify(s);
        }
    }

    static SymbolIsTerminal(s: GeneratorGrammarSymbol) {
        return !(typeof s === 'string' || 'rule' in s);
    }

}