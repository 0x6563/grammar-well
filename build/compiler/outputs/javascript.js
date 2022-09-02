"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ESMOutput = exports.JavascriptOutput = void 0;
const util_1 = require("./util");
function JavascriptOutput(state, exportName) {
    return `${Compile(state, exportName)}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = ${exportName};
} else {
    window.${exportName} = ${exportName};
}`;
}
exports.JavascriptOutput = JavascriptOutput;
function ESMOutput(state, exportName) {
    return `${Compile(state, exportName)}

export default ${exportName};`;
}
exports.ESMOutput = ESMOutput;
;
function Compile(state, exportName) {
    return `// Generated automatically by Grammar-Well, version ${state.version} 
// https://github.com/0x6563/grammar-well
${state.head.join('\n')}
function ${exportName}(){
    ${state.body.join('\n')}
    return ${(0, util_1.SerializeState)(state, 1)}
}`;
}
;
//# sourceMappingURL=javascript.js.map