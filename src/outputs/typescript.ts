import { GrammarBuilderState } from "../lib/grammar-builder";
import { serializeRules } from "./util";

const TypescriptPostProcessors = {
    "joiner": "(d) => d.join('')",
    "arrconcat": "(d) => [d[0]].concat(d[1])",
    "arrpush": "(d) => d[0].concat([d[1]])",
    "nuller": "() => null",
    "id": "id"
};

export function TypescriptFormat(grammar: GrammarBuilderState, exportName: string) {
    return `// Generated automatically by nearley, version ${grammar.version}
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
${Array.from(grammar.customTokens).map(function (token) { return "declare var " + token + ": any;\n" }).join("")}
${grammar.body.join('\n')}

interface NearleyToken {
    value: any;
    [key: string]: any;
};

interface NearleyLexer {
    reset: (chunk: string, info: any) => void;
    next: () => NearleyToken | undefined;
    save: () => any;
    formatError: (token: never) => string;
    has: (tokenType: string) => boolean;
};

interface NearleyRule {
    name: string;
    symbols: NearleySymbol[];
    postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
    lexer: NearleyLexer | undefined;
    rules: NearleyRule[];
    start: string;
};

const grammar: Grammar = {
    lexer: ${grammar.config.lexer},
    rules: ${serializeRules(grammar.rules, TypescriptPostProcessors, "  ")},
    start: ${JSON.stringify(grammar.start)},
};

export default grammar;
`;
};