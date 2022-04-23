"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ESMOutput = exports.JavascriptOutput = exports.JavascriptPostProcessors = void 0;
var util_1 = require("./util");
exports.JavascriptPostProcessors = {
    "joiner": "function joiner(d) {return d.join('');}",
    "arrconcat": "function arrconcat(d) {return [d[0]].concat(d[1]);}",
    "arrpush": "function arrpush(d) {return d[0].concat([d[1]]);}",
    "nuller": "function(d) {return null;}",
    "id": "id"
};
function JavascriptOutput(parser, exportName) {
    return "// Generated automatically by nearley, version ".concat(parser.version, " \n// http://github.com/Hardmath123/nearley\n(function () {\nfunction id(x) { return x[0]; }\n").concat(parser.body.join('\n'), "\nvar grammar = {\n    Lexer: ").concat(parser.config.lexer, ",\n    ParserRules: ").concat((0, util_1.serializeRules)(parser.rules, exports.JavascriptPostProcessors), "\n  , ParserStart: ").concat(JSON.stringify(parser.start), "\n}\nif (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {\n   module.exports = grammar;\n} else {\n   window.").concat(exportName, " = grammar;\n}\n})();\n");
}
exports.JavascriptOutput = JavascriptOutput;
function ESMOutput(parser, exportName) {
    return "// Generated automatically by nearley, version ".concat(parser.version, " \n// http://github.com/Hardmath123/nearley\nfunction id(x) { return x[0]; }\n").concat(parser.body.join('\n'), "\nlet Lexer = ").concat(parser.config.lexer, ";\nlet ParserRules = ").concat((0, util_1.serializeRules)(parser.rules, exports.JavascriptPostProcessors), ";\nlet ParserStart = ").concat(JSON.stringify(parser.start), ";\nexport default { Lexer, ParserRules, ParserStart };\n");
}
exports.ESMOutput = ESMOutput;
;
//# sourceMappingURL=javascript.js.map