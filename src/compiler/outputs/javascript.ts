import { GeneratorState } from "../../typings";
import { SerializeState } from "./util";

export function JavascriptOutput(state: GeneratorState, exportName: string) {
    return `${Compile(state, exportName)}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = ${exportName};
} else {
    window.${exportName} = ${exportName};
}`;
}

export function ESMOutput(state: GeneratorState, exportName: string) {
    return `${Compile(state, exportName)}

export default ${exportName};`;
};

function Compile(state: GeneratorState, exportName: string) {
    return `// Generated automatically by Grammar-Well, version ${state.version} 
// https://github.com/0x6563/grammar-well
${state.head.join('\n')}
function ${exportName}(){
    ${state.body.join('\n')}
    return ${SerializeState(state, 1)}
}`;
};
