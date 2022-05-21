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
|                      | Grammar Well                           | Nearley                                |
| -------------------- | -------------------------------------- | -------------------------------------- |
| calculator: parse    | 13,542.01  ops/sec  ±3.80%  (79 runs)  | 15,069.82  ops/sec  ±3.78%  (80 runs)  |
| json: parse sample1k |    122.33  ops/sec  ±3.46%  (74 runs)  |    148.07  ops/sec  ±4.49%  (68 runs)  |
| tosh: parse          |  2,448.34  ops/sec  ±3.49%  (78 runs)  |  2,761.46  ops/sec  ±3.73%  (77 runs)  |