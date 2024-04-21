"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypescriptFormat = void 0;
function TypescriptFormat(generator, exportName) {
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
exports.TypescriptFormat = TypescriptFormat;
//# sourceMappingURL=typescript.js.map