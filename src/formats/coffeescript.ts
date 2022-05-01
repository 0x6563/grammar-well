import { dedentFunc, serializeRules, tabulateString } from "./util";

const CoffeescriptPostProcessors = {
    "joiner": "(d) -> d.join('')",
    "arrconcat": "(d) -> [d[0]].concat(d[1])",
    "arrpush": "(d) -> d[0].concat([d[1]])",
    "nuller": "() -> null",
    "id": "id"
};


export function CoffeescriptOutput(parser, exportName) {
    return `# Generated automatically by nearley, version ${parser.version}
# http://github.com/Hardmath123/nearley
do ->
  id = (d) -> d[0]
${tabulateString(dedentFunc(parser.body.join('\n')), '  ')}
  grammar = {
    lexer: ${parser.config.lexer},
    rules: ${tabulateString(serializeRules(parser.rules, CoffeescriptPostProcessors), '      ', { indentFirst: false })},
    start: ${JSON.stringify(parser.start)}
  }
  if typeof module != 'undefined' && typeof module.exports != 'undefined'
    module.exports = grammar;
  else
    window.${exportName} = grammar;
`;
}