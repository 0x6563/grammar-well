import { JavaScriptGenerator } from "../javascript.js";

export function CJSOutput(generator: JavaScriptGenerator) {
    const exportName = generator.name();
    return `${Generate(generator)}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = ${exportName};
} else {
    window.${exportName} = ${exportName};
}`;
}

export function ESMOutput(generator: JavaScriptGenerator) {
    return `${Generate(generator)}\n\nexport default ${generator.name()};`;
}

function Generate(generator: JavaScriptGenerator) {
    const exportName = generator.name();
    return `// Generated automatically by Grammar-Well, version ${generator.state.version} 
// https://github.com/0x6563/grammar-well
${generator.head()}
function ${exportName}(){
    ${generator.body()}
    return ${generator.artifacts(1)}
}`;
}
