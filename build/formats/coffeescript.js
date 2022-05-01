"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoffeescriptOutput = void 0;
const util_1 = require("./util");
const CoffeescriptPostProcessors = {
    "joiner": "(d) -> d.join('')",
    "arrconcat": "(d) -> [d[0]].concat(d[1])",
    "arrpush": "(d) -> d[0].concat([d[1]])",
    "nuller": "() -> null",
    "id": "id"
};
function CoffeescriptOutput(parser, exportName) {
    return `# Generated automatically by nearley, version ${parser.version}
# http://github.com/Hardmath123/nearley
do ->
  id = (d) -> d[0]
${(0, util_1.tabulateString)((0, util_1.dedentFunc)(parser.body.join('\n')), '  ')}
  grammar = {
    lexer: ${parser.config.lexer},
    rules: ${(0, util_1.tabulateString)((0, util_1.serializeRules)(parser.rules, CoffeescriptPostProcessors), '      ', { indentFirst: false })},
    start: ${JSON.stringify(parser.start)}
  }
  if typeof module != 'undefined' && typeof module.exports != 'undefined'
    module.exports = grammar;
  else
    window.${exportName} = grammar;
`;
}
exports.CoffeescriptOutput = CoffeescriptOutput;
//# sourceMappingURL=coffeescript.js.map