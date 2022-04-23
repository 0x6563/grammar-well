"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypescriptFormat = void 0;
var util_1 = require("./util");
var TypescriptPostProcessors = {
    "joiner": "(d) => d.join('')",
    "arrconcat": "(d) => [d[0]].concat(d[1])",
    "arrpush": "(d) => d[0].concat([d[1]])",
    "nuller": "() => null",
    "id": "id"
};
function TypescriptFormat(parser, exportName) {
    return "// Generated automatically by nearley, version ".concat(parser.version, "\n// http://github.com/Hardmath123/nearley\n// Bypasses TS6133. Allow declared but unused functions.\n// @ts-ignore\nfunction id(d: any[]): any { return d[0]; }\n").concat(parser.customTokens.map(function (token) { return "declare var " + token + ": any;\n"; }).join(""), "\n").concat(parser.body.join('\n'), "\n\ninterface NearleyToken {\n    value: any;\n    [key: string]: any;\n};\n\ninterface NearleyLexer {\n    reset: (chunk: string, info: any) => void;\n    next: () => NearleyToken | undefined;\n    save: () => any;\n    formatError: (token: never) => string;\n    has: (tokenType: string) => boolean;\n};\n\ninterface NearleyRule {\n    name: string;\n    symbols: NearleySymbol[];\n    postprocess?: (d: any[], loc?: number, reject?: {}) => any;\n};\n\ntype NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };\n\ninterface Grammar {\n    Lexer: NearleyLexer | undefined;\n    ParserRules: NearleyRule[];\n    ParserStart: string;\n};\n\nconst grammar: Grammar = {\n    Lexer: ").concat(parser.config.lexer, ",\n    ParserRules: ").concat((0, util_1.serializeRules)(parser.rules, TypescriptPostProcessors, "  "), ",\n    ParserStart: ").concat(JSON.stringify(parser.start), ",\n};\n\nexport default grammar;\n");
}
exports.TypescriptFormat = TypescriptFormat;
;
//# sourceMappingURL=typescript.js.map