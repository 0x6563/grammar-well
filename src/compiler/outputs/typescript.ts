import { Generator } from "../generator/generator";

export function TypescriptFormat(generator: Generator, exportName: string) {
    return `// Generated automatically by Grammar-Well, version ${generator.state.version} 
// https://github.com/0x6563/grammar-well
import type { LanguageDefinition } from 'grammar-well';

${generator.serializeHead()}

function ${exportName}(): LanguageDefinition {
    ${generator.serializeBody()}
    return ${generator.serializeLanguage(1)}
}

export default ${exportName};

`;
}