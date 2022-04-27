
const { readFileSync } = require('fs');

const { interpreter } = require('./_shared');

function read(filename) {
  return readFileSync(filename, 'utf-8');
}

// Define benchmarks

/*suite('nearley: parse scannerless-nearley.ne', () => {
  //const nearleyGrammar = read('lib/nearley-language-bootstrapped.ne')
  const nearleyGrammar = read('test/grammars/scannerless-nearley.ne')

  const parseLexer = makeParser('lib/nearley-language-bootstrapped.ne')
  benchmark('current', () => parseLexer(nearleyGrammar))

  const parseScannerless = makeParser('test/grammars/scannerless-nearley.ne')
  benchmark('scannerless', () => parseScannerless(nearleyGrammar))
})

suite('nearley: parse tosh.ne', () => {
  const toshGrammar = read('examples/tosh.ne')

  const parseLexer = makeParser('lib/nearley-language-bootstrapped.ne')
  benchmark('current', () => parseLexer(toshGrammar))

  const parseScannerless = makeParser('test/grammars/scannerless-nearley.ne')
  benchmark('scannerless', () => parseScannerless(toshGrammar))
})*/

suite('calculator: parse', () => {
  const exampleFile = 'ln (3 + 2*(8/e - sin(pi/5)))'

  const runner = interpreter(read('examples/calculator/arithmetic.ne'))
  benchmark('nearley', () => runner.run(exampleFile))

})

suite('json: parse sample1k', () => {
  const jsonFile = read('legacy-test/grammars/sample1k.json')

  const runner = interpreter(read('examples/json.ne'))
  benchmark('nearley', () => runner.run(jsonFile))

  //benchmark('native JSON 😛', () => JSON.parse(jsonFile))

})

suite('tosh: parse', () => {
  const toshFile = 'set foo to 2 * e^ of ( foo * -0.05 + 0.5) * (1 - e ^ of (foo * -0.05 + 0.5))'

  const runner = interpreter(read('examples/tosh.ne'))
  benchmark('nearley', () => runner.run(toshFile))

})

