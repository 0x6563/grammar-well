import { JavaScriptGenerator } from "../javascript.ts";

export function TypescriptFormat(generator: JavaScriptGenerator) {
    const exportName = generator.name();
    return `// Generated automatically by Grammar-Well, version ${generator.state.version} 
// https://github.com/0x6563/grammar-well
// @ts-nocheck

${generator.lifecycle('import').join('')}

class ${exportName} {
    state = {};
    artifacts = ${generator.artifacts(1)}
    constructor(){${generator.lifecycle('new').join('')}}
}

export default ${exportName};`;
}