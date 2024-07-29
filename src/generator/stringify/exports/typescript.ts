import { JavaScriptGenerator } from "../javascript.js";

export function TypescriptFormat(generator: JavaScriptGenerator) {
    const exportName = generator.name();
    return `// Generated automatically by Grammar-Well, version ${generator.state.version} 
// https://github.com/0x6563/grammar-well
import type { RuntimeLanguageDefinition } from 'grammar-well';

${generator.head()}

function ${exportName}(): RuntimeLanguageDefinition {
    ${generator.body()}
    return ${generator.artifacts(1)}
}

export default ${exportName};

`;
}