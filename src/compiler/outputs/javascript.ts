import { Generator } from "../generator";

export function JavascriptOutput(generator: Generator, exportName: string) {
    return `${Generate(generator, exportName)}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = ${exportName};
} else {
    window.${exportName} = ${exportName};
}`;
}

export function ESMOutput(generator: Generator, exportName: string) {
    return `${Generate(generator, exportName)}

export default ${exportName};`;
}

function Generate(generator: Generator, exportName: string) {
    return `// Generated automatically by Grammar-Well, version ${generator.state.version} 
// https://github.com/0x6563/grammar-well
${generator.serializeHead()}
function ${exportName}(){
    ${generator.serializeBody()}
    return ${generator.serializeLanguage(1)}
}`;
}
