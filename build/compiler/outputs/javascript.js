"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ESMOutput = exports.JavascriptOutput = exports.JavascriptPostProcessors = void 0;
const util_1 = require("./util");
exports.JavascriptPostProcessors = {
    "joiner": "function joiner(d) {return d.join('');}",
    "arrconcat": "function arrconcat(d) {return [d[0]].concat(d[1]);}",
    "arrpush": "function arrpush(d) {return d[0].concat([d[1]]);}",
    "nuller": "function(d) {return null;}",
    "id": "id"
};
function JavascriptOutput(parser, exportName) {
    return `${Compile(parser)}

if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = Grammar;
} else {
   window.${exportName} = Grammar;
}
`;
}
exports.JavascriptOutput = JavascriptOutput;
function ESMOutput(parser, exportName) {
    return `${Compile(parser)}

export default Grammar;
`;
}
exports.ESMOutput = ESMOutput;
;
function Compile(parser) {
    return `// Generated automatically by Grammar-Well, version ${parser.version} 
// https://github.com/0x6563/grammar-well

${parser.head.join('\n')}

function Grammar(){
    function id(x) { return x[0]; }
    ${parser.body.join('\n')}
    return {
        lexer: ${parser.config.lexer},
        rules: ${(0, util_1.serializeRules)(parser.rules, exports.JavascriptPostProcessors)},
        start: ${JSON.stringify(parser.start)}
    }
}`;
}
;
//# sourceMappingURL=javascript.js.map