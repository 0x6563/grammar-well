# Grammar Well
A cross-platform grammar compiler and interpreter. That aims to facilitate a simple way to create and evaluate custom grammars on the front-end and back-end. Formerly a TypeScript port of [Nearley](https://github.com/kach/nearley).

## QuickStart

The easiest way to generate a compiled js file is to use the `Compile` function.
```TypeScript
import { Compile } from 'grammar-well';
import { writeFileSync } from 'fs';
const config = {}; 
const js = Compile(grammarString, config);
writeFileSync('./precompiledGrammar.js', js);
```

To run input using your compiled js:
```TypeScript
    const result = Interpret(require('./precompiledGrammar.js'), input);
```

## Grammar Syntax
Currently all of Nearley's syntax is supported. You can find more info at [https://nearley.js.org/docs/grammar](https://nearley.js.org/docs/grammar).
In addition to that Grammar Well supports an additional post processor tokens `${  }` this is to differentiate between Nearley's postprocessor signature and Grammar Well's.

Example
```
expression -> number "+" number ${ function ({data, reference, dot, name , reject}) { return data[0] + data[2]; } }
```

Check out the [Live Editor](https://0x6563.github.io/grammar-well-editor/)