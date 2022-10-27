# Grammar Well
A cross-platform grammar compiler and interpreter. That aims to facilitate a simple way to create and evaluate custom grammars on the front-end and back-end. Formerly a TypeScript port of [Nearley](https://github.com/kach/nearley).

Check out the [Live Editor](https://0x6563.github.io/grammar-well-editor/)

## QuickStart

The easiest way to generate a compiled js file is to use the `Compile` function.
```TypeScript
import { Compile } from 'grammar-well';
import { writeFileSync } from 'fs';
const config = {}; 
const js = await Compile(grammarString, config);
writeFileSync('./precompiledGrammar.js', js);
```

To run input using your compiled js:
```TypeScript
    import { Parse } from 'grammar-well';
    const result = Parse(require('./precompiledGrammar.js'), input);
```

## Grammar Syntax
The gwell file is broken into multiple sections

### Grammar

Example:
```
grammar: {
    json -> _ (object | array) _ : {{ $1[0] }}

    object -> "{" _ "}" : {{ {} }}
        | "{" _ pair (_ "," _ pair)* _ "}" : ${ extractObject }

    array -> "[" _ "]" : {{ [] }}
        | "[" _ value (_ "," _ value)* _ "]" : ${ extractArray }

    value : {{ $0 }} ->
        object
        | array
        | number
        | string
        | "true" : {{ true }}
        | "false" : {{ false }}
        | "null" : {{ null }}

    number -> $number : {{ parseFloat($0.value) }}

    string -> $string : {{ JSON.parse($0.value) }}

    pair -> key:k _ ":" _ value:v : {{ [$k, $v] }}

    key -> string : {{ $0 }}

    _ -> $space? : {{ null }}
}
```
A production rule consists of a non-terminal word on the left the `->` arrow and a set of expressions on the right, followed by an optional postprocessor seperated by `:` and wrapped in either `${ }` or `{{ }}`.
Take for example the Production Rule `key -> string : {{ $0 }}`
**`key`** is the left hand Non Terminal
**`->`** separates the left hand from the right hand
**`string`** is a Non Terminal
**` : `** separates the post processor, note that the space before the colon is required. 
**`{{ $0 }}`** is a templated post processor which will be transformed to `({ data }) => data[0]` at compile time.


### Templated Post Processor
Template Post Processors, identified by `{{ }}` help reduce boilerplate as well as grant the ability to use Indexed References and Alias References. 

Example: Indexed Reference
```
key -> string : {{ $0 }}
       ^        <------>

...will generate the post processor function:

({ data }) => data[0]
```


Example: Alias Reference

```
pair -> key:k _ ":" _ value:v : {{ [$k, $v] }}
            ^               ^   <------------>

...will generate the post processor function:

({ data }) => [data[0], data[4]]
```

### Literal Post Processor 
Literal Post Processors, identified by `${ }` allow you to write raw JavaScript for the post processor.



### Word
Words are limited to the regex expression `/[a-z_][a-zA-Z\d_]/` 