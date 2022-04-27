"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypescriptFormat = void 0;
const util_1 = require("./util");
const TypescriptPostProcessors = {
    "joiner": "(d) => d.join('')",
    "arrconcat": "(d) => [d[0]].concat(d[1])",
    "arrpush": "(d) => d[0].concat([d[1]])",
    "nuller": "() => null",
    "id": "id"
};
function TypescriptFormat(parser, exportName) {
    return `// Generated automatically by nearley, version ${parser.version}
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
${parser.customTokens.map(function (token) { return "declare var " + token + ": any;\n"; }).join("")}
${parser.body.join('\n')}

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
    Lexer: NearleyLexer | undefined;
    ParserRules: NearleyRule[];
    ParserStart: string;
};

const grammar: Grammar = {
    Lexer: ${parser.config.lexer},
    ParserRules: ${(0, util_1.serializeRules)(parser.rules, TypescriptPostProcessors, "  ")},
    ParserStart: ${JSON.stringify(parser.start)},
};

export default grammar;
`;
}
exports.TypescriptFormat = TypescriptFormat;
;
//# sourceMappingURL=typescript.js.map