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
Currently all of Nearley's syntax is supported. You can find more info at [https://nearley.js.org/docs/grammar](https://nearley.js.org/docs/grammar).
In addition to that Grammar Well supports an additional post processor tokens `${  }` this is to differentiate between Nearley's postprocessor signature and Grammar Well's.

Example
```
expression -> number "+" number ${ function ({data, reference, dot, name , reject}) { return data[0] + data[2]; } }
```

## Benchmarks
|            |            Nearley |       Grammar Well |            Results |
|------------|--------------------|--------------------|--------------------|
| Calculator | 14078 (±2.06 x 91) | 12715 (±2.09 x 89) |            -10.17% |
|       Tosh |  2393 (±2.96 x 89) |  2233 (±2.81 x 87) |             -6.92% |
|       JSON |   111 (±2.99 x 73) |    80 (±4.76 x 61) |            -32.46% |
|        Lua |  1629 (±3.06 x 89) |  1638 (±2.63 x 88) |             +0.55% |
|        CSV |   423 (±2.47 x 86) |   434 (±2.72 x 86) |             +2.57% |