# Grammar Well

Grammar Well is a cross-platform compiler, parser, and/or interpreter. It originated as a port of the popular library [Nearley](https://github.com/kach/nearley) to TypeScript but has since evolved to include additional functionality, such as a built-in lexer and support for various parsing algorithms including LR0 and CKY. It also offers a range of quality of life features.

Check out the documentation at https://grammar-well.xyz/

# Quick Start
### Install
`npm i grammar-well`

### Example

```Javascript
import { Compile, Parse } from 'grammar-well';

const source = `
import * from whitespace;

lexer {
	start: "json"

	[json]
		- import whitespace
		- when r:{-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b} tag "number"
		- when r:{"(?:\\["bfnrt/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"} tag "string"
		- when "{" tag "{"
		- when "}" tag "}"
		- when "[" tag "["
		- when "]" tag "]"
		- when "," tag ","
		- when ":" tag ":"
		- when "true" tag "true"
		- when "false" tag "false"
		- when "null" tag "null"

}

grammar {
	start: "json"

	[json]
		| _ (object | array) _ => ( $1[0] )

	[object]
		| "{" _ "}" => ( {} )
		| "{" _ pair (_ "," _ pair)* _ "}" => \${ extractObject }

	[array]
		| "[" _ "]" => ( [] )
		| "[" _ value (_ "," _ value)* _ "]" => \${ extractArray }

	[value]
		| object => ( $0 )
		| array => ( $0 )
		| number => ( $0 )
		| string => ( $0 )
		| "true" => ( true )
		| "false" => ( false )
		| "null" => ( null )

	[number]
		| <number> => ( parseFloat($0.value) )

	[string]
		| <string> => ( JSON.parse($0.value) )

	[pair]
		| key@k _ ":" _ value@v => ( [$k, $v] )

	[key]
		| string => ( $0 )

}

on:import {
    function extractPair(kv, output) {
        if(kv[0]) { output[kv[0]] = kv[1]; }
    }

    function extractObject({data}) {
        let output = {};

        extractPair(data[2], output);

        for (let i in data[3]) {
            extractPair(data[3][i][3], output);
        }

        return output;
    }

    function extractArray({data}) {
        let output = [data[2]];

        for (let i in data[3]) {
            output.push(data[3][i][3]);
        }

        return output;
    }
}`

const javascriptsource = await Generate(source, {
    output: {
        name: 'grammar',
        format: 'typescript',
        artifacts: {
            lexer: true,
            grammar: true
        }
    }
});
```