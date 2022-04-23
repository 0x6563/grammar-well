import { serializeRules } from "./util";

export const JavascriptPostProcessors = {
    "joiner": "function joiner(d) {return d.join('');}",
    "arrconcat": "function arrconcat(d) {return [d[0]].concat(d[1]);}",
    "arrpush": "function arrpush(d) {return d[0].concat([d[1]]);}",
    "nuller": "function(d) {return null;}",
    "id": "id"
}

export function JavascriptOutput(parser, exportName) {
    return `// Generated automatically by nearley, version ${parser.version} 
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
${parser.body.join('\n')}
var grammar = {
    Lexer: ${parser.config.lexer},
    ParserRules: ${serializeRules(parser.rules, JavascriptPostProcessors)}
  , ParserStart: ${JSON.stringify(parser.start)}
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.${exportName} = grammar;
}
})();
`;
}

export function ESMOutput(parser, exportName) {
    return `// Generated automatically by nearley, version ${parser.version} 
// http://github.com/Hardmath123/nearley
function id(x) { return x[0]; }
${parser.body.join('\n')}
let Lexer = ${parser.config.lexer};
let ParserRules = ${serializeRules(parser.rules, JavascriptPostProcessors)};
let ParserStart = ${JSON.stringify(parser.start)};
export default { Lexer, ParserRules, ParserStart };
`;
};