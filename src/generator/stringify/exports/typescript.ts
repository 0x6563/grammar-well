import { JavaScriptGenerator } from "../javascript";

export function TypescriptFormat(generator: JavaScriptGenerator, exportName: string) {
    return `// Generated automatically by Grammar-Well, version ${generator.state.version} 
// https://github.com/0x6563/grammar-well
import type { LanguageDefinition } from 'grammar-well';

${generator.head()}

function ${exportName}(): LanguageDefinition {
    ${generator.body()}
    return ${generator.artifacts(1)}
}

export default ${exportName};

`;
}