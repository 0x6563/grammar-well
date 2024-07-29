export function TypescriptFormat(generator) {
    const exportName = generator.name();
    return `// Generated automatically by Grammar-Well, version ${generator.state.version} 
// https://github.com/0x6563/grammar-well
// @ts-nocheck

${generator.head()}

class ${exportName} {
    artifacts =  ${generator.artifacts(1)}
    constructor(){${generator.body()}}
}

export default ${exportName};`;
}
//# sourceMappingURL=typescript.js.map