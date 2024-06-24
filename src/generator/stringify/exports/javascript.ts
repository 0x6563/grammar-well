import { JavaScriptGenerator } from "../javascript.js";

export function CJSOutput(generator: JavaScriptGenerator, exportName: string) {
    return `${Generate(generator, exportName)}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = ${exportName};
} else {
    window.${exportName} = ${exportName};
}`;
}

export function ESMOutput(generator: JavaScriptGenerator, exportName: string) {
    return `${Generate(generator, exportName)}

export default ${exportName};`;
}

function Generate(generator: JavaScriptGenerator, exportName: string) {
    return `// Generated automatically by Grammar-Well, version ${generator.state.version} 
// https://github.com/0x6563/grammar-well
${generator.head()}
function ${exportName}(){
    ${generator.body()}
    return ${generator.artifacts(1)}
}`;
}
