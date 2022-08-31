import { serializeRules } from "./util";

export const JavascriptPostProcessors = {
    "joiner": "function joiner({data}) {return data.join('');}",
    "arrconcat": "function arrconcat({data}) {return [data[0]].concat(data[1]);}",
    "arrpush": "function arrpush({data}) {return data[0].concat([data[1]]);}",
    "nuller": "function({data}) {return null;}",
    "id": "id"
}

export function JavascriptOutput(parser, exportName) {
    return `${Compile(parser)}

if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = Grammar;
} else {
   window.${exportName} = Grammar;
}
`;
}

export function ESMOutput(parser, exportName) {
    return `${Compile(parser)}

export default Grammar;
`;
};

function Compile(parser) {
    return `// Generated automatically by Grammar-Well, version ${parser.version} 
// https://github.com/0x6563/grammar-well

${parser.head.join('\n')}

function Grammar(){
    function id(x) { return x.data[0]; }
    ${parser.body.join('\n')}
    return {
        lexer: ${parser.config.lexer},
        rules: ${serializeRules(parser.rules, JavascriptPostProcessors)},
        start: ${JSON.stringify(parser.start)}
    }
}`;
};
