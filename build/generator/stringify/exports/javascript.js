export function CJSOutput(generator) {
    const exportName = generator.name();
    return `${Generate(generator)}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = ${exportName};
} else {
    window.${exportName} = ${exportName};
}`;
}
export function ESMOutput(generator) {
    return `${Generate(generator)}\n\nexport default ${generator.name()};`;
}
function Generate(generator) {
    const exportName = generator.name();
    return `// Generated automatically by Grammar-Well, version ${generator.state.version} 
// https://github.com/0x6563/grammar-well

${generator.lifecycle('import').join('')}

class ${exportName} {
    state = {};
    artifacts = ${generator.artifacts(1)}
    constructor(){${generator.lifecycle('new').join('')}}
}`;
}
//# sourceMappingURL=javascript.js.map