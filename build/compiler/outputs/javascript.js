"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ESMOutput = exports.JavascriptOutput = void 0;
function JavascriptOutput(generator, exportName) {
    return `${Generate(generator, exportName)}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = ${exportName};
} else {
    window.${exportName} = ${exportName};
}`;
}
exports.JavascriptOutput = JavascriptOutput;
function ESMOutput(generator, exportName) {
    return `${Generate(generator, exportName)}

export default ${exportName};`;
}
exports.ESMOutput = ESMOutput;
function Generate(generator, exportName) {
    return `// Generated automatically by Grammar-Well, version ${generator.state.version} 
// https://github.com/0x6563/grammar-well
${generator.serializeHead()}
function ${exportName}(){
    ${generator.serializeBody()}
    return ${generator.serializeLanguage(1)}
}`;
}
//# sourceMappingURL=javascript.js.map