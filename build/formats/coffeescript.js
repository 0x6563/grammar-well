"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoffeescriptOutput = void 0;
var util_1 = require("./util");
var CoffeescriptPostProcessors = {
    "joiner": "(d) -> d.join('')",
    "arrconcat": "(d) -> [d[0]].concat(d[1])",
    "arrpush": "(d) -> d[0].concat([d[1]])",
    "nuller": "() -> null",
    "id": "id"
};
function CoffeescriptOutput(parser, exportName) {
    return "# Generated automatically by nearley, version ".concat(parser.version, "\n# http://github.com/Hardmath123/nearley\ndo ->\n  id = (d) -> d[0]\n").concat((0, util_1.tabulateString)((0, util_1.dedentFunc)(parser.body.join('\n')), '  '), "\n  grammar = {\n    Lexer: ").concat(parser.config.lexer, ",\n    ParserRules: ").concat((0, util_1.tabulateString)((0, util_1.serializeRules)(parser.rules, CoffeescriptPostProcessors), '      ', { indentFirst: false }), ",\n    ParserStart: ").concat(JSON.stringify(parser.start), "\n  }\n  if typeof module != 'undefined' && typeof module.exports != 'undefined'\n    module.exports = grammar;\n  else\n    window.").concat(exportName, " = grammar;\n");
}
exports.CoffeescriptOutput = CoffeescriptOutput;
//# sourceMappingURL=coffeescript.js.map