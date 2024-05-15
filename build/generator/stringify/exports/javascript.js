"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ESMOutput = exports.CJSOutput = void 0;
function CJSOutput(generator, exportName) {
    return `${Generate(generator, exportName)}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = ${exportName};
} else {
    window.${exportName} = ${exportName};
}`;
}
exports.CJSOutput = CJSOutput;
function ESMOutput(generator, exportName) {
    return `${Generate(generator, exportName)}

export default ${exportName};`;
}
exports.ESMOutput = ESMOutput;
function Generate(generator, exportName) {
    return `// Generated automatically by Grammar-Well, version ${generator.state.version} 
// https://github.com/0x6563/grammar-well
${generator.head()}
function ${exportName}(){
    ${generator.body()}
    return ${generator.artifacts(1)}
}`;
}
//# sourceMappingURL=javascript.js.map