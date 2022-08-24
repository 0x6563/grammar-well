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
function TypescriptFormat(grammar, exportName) {
    return `// Generated automatically by Grammar-Well, version ${grammar.version} 
// https://github.com/0x6563/grammar-well

interface PrecompiledGrammar {
    lexer?: Lexer;
    start: string;
    rules: Rule[];
    map?: { [key: string]: Rule[] };
}


interface Rule {
    name: string;
    symbols: RuleSymbol[];
    transform?: PostTransform;
}

type PostTransform = (payload: PostTransformPayload) => any;

type RuleSymbol = string | RegExp | RuleSymbolToken | RuleSymbolLexerToken | LexerToken | RuleSymbolTestable;

interface PostTransformPayload {
    data: any[];
    reference: number;
    dot: number;
    name: string;
    reject: Symbol;
}

interface LexerToken {
    token: string;
}

interface RuleSymbolToken {
    literal: any;
}

interface RuleSymbolTestable {
    test: (data: any) => boolean;
}

interface RuleSymbolLexerToken {
    type: string;
    value: string;
    text: string;
}

interface Lexer {
    readonly line?: number;
    readonly column?: number;
    readonly index: number;
    readonly current: any;
    readonly state: LexerState;

    feed(chunk: string, flush?: boolean): void;
    flush(): void;
    reset(chunk?: string): void;
    restore(state: LexerState): void;
    next(): any;
    previous(): any;
    peek(offset: number): any;
}

interface LexerState {
    index: number;
    indexOffset: number;
    line?: number;
    lineOffset?: number;
    column?: number;
}

${grammar.head.join('\n')}

function Grammar(): PrecompiledGrammar {
    
    // Bypasses TS6133. Allow declared but unused functions.
    // @ts-ignore
    function id(d: any[]): any { return d[0]; }
    ${Array.from(grammar.customTokens).map(function (token) { return "declare var " + token + ": any;\n"; }).join("")}
    ${grammar.body.join('\n')}
    return {
        lexer: ${grammar.config.lexer},
        rules: ${(0, util_1.serializeRules)(grammar.rules, TypescriptPostProcessors, "  ")},
        start: ${JSON.stringify(grammar.start)},
    };
}

export default Grammar;

`;
}
exports.TypescriptFormat = TypescriptFormat;
;
//# sourceMappingURL=typescript.js.map