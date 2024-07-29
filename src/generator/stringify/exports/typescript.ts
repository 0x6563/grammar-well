import { JavaScriptGenerator } from "../javascript.js";

export function TypescriptFormat(generator: JavaScriptGenerator) {
    const exportName = generator.name();
    return `// Generated automatically by Grammar-Well, version ${generator.state.version} 
// https://github.com/0x6563/grammar-well
import { RuntimeLanguageDefinition } from 'grammar-well';
${generator.head()}

class ${exportName} {
    artifacts =  ${generator.artifacts(1)}
    constructor(){
        ${generator.body()}
    }
}

export default ${exportName};

`;
}