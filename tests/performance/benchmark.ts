import type { GeneratorOutputOptions, RuntimeParserClass } from "../../build/index.js";
import { GetValue, ReadConfigFile } from "../utilities/config.ts";
import { Eval } from "../utilities/eval.ts";
import { Compile, ParseInput } from "../utilities/language.ts";
import { ConsoleTable } from "../utilities/logging.ts";
import { Benchmark } from "../utilities/timings.ts";

const benchmarks: BenchmarkConfig[] = ReadConfigFile(import.meta.dirname, 'benchmark.config.yml');
const suite = [];
for (const benchmark of benchmarks) {
  const { title } = benchmark;
  const defaults = {
    grammar: GetValue(benchmark, 'grammar'),
    input: GetValue(benchmark, 'input'),
    algorithm: benchmark.algorithm,
    compilerOptions: benchmark.compilerOptions,
    compilerIterations: benchmark.compilerIterations,
    parserOptions: benchmark.parserOptions,
    parserIterations: benchmark.parserIterations,
  }
  const results = [];
  for (const test of benchmark.tests) {
    const { title } = test;
    const grammar = GetValue(benchmark, 'grammar') || defaults.grammar;
    const input = GetValue(benchmark, 'input') || defaults.input;
    const algorithm = benchmark.algorithm || defaults.algorithm;
    const compilerOptions = benchmark.compilerOptions || defaults.compilerOptions;
    const compilerIterations = benchmark.compilerIterations || defaults.compilerIterations || 1000;
    const parserOptions = benchmark.parserOptions || defaults.parserOptions;
    const parserIterations = benchmark.parserIterations || defaults.parserIterations || 1;
    results.push({ title, compilerIterations, parserIterations, ...await BenchmarkTest(grammar, input, algorithm, compilerOptions, parserOptions, compilerIterations, parserIterations) })
  }
  suite.push({ title, results });
  console.log(title);
  const s = ConsoleTable(results, [
    {
      label: 'Test',
      value: 'title'
    },
    {
      label: 'Compiling Cold',
      value: (row) => row.compiling.cold.toFixed(2)
    },
    {
      label: 'Compiling Hot',
      value: (row) => row.compiling.hot.toFixed(2)
    },
    {
      label: 'Compiling Deviation',
      value: (row) => row.compiling.deviation.toFixed(2)
    },
    {
      label: 'Compiling Iterations',
      value: (row) => row.compilerIterations.toFixed(2)
    },
    {
      label: 'Parsing Cold',
      value: (row) => row.parsing.cold.toFixed(2)
    },
    {
      label: 'Parsing Hot',
      value: (row) => row.parsing.hot.toFixed(2)
    },
    {
      label: 'Parsing Deviation',
      value: (row) => row.parsing.deviation.toFixed(2)
    },
    {
      label: 'Parsing Iterations',
      value: (row) => row.parserIterations.toFixed(2)
    }
  ])
  console.log(s);
}


interface BenchmarkConfig {
  title: string;
  grammar: string;
  input: string;
  algorithm: 'earley';
  compilerOptions?: GeneratorOutputOptions;
  compilerIterations?: number;
  parserOptions?: any;
  parserIterations?: number;
  tests: {
    title: string;
    grammar: string;
    input: string;
    algorithm: 'earley';
    compilerOptions?: GeneratorOutputOptions;
    compilerIterations?: number;
    parserOptions?: any;
    parserIterations?: number;
  }[]
}


async function BenchmarkTest(grammar: string, input: string, algorithm: 'earley' = 'earley', compilerOptions: GeneratorOutputOptions = {}, parserOptions: {} = {}, compilerIterations: number = 1, parserIterations: number = 1000) {
  const compiling = await Benchmark(() => Compile(grammar, compilerOptions), compilerIterations);

  const parser: RuntimeParserClass = Eval(compiling.output);
  const parsing = await Benchmark(() => ParseInput(new parser(), input, { algorithm, parserOptions }), parserIterations);

  delete parsing.output;
  delete (compiling as any).output;

  return { compiling, parsing }
}