export function CJSOutput(generator, exportName) {
    return `${Generate(generator, exportName)}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = ${exportName};
} else {
    window.${exportName} = ${exportName};
}`;
}
export function ESMOutput(generator, exportName) {
    return `${Generate(generator, exportName)}

export default ${exportName};`;
}
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