import type { GeneratorOutputOptions, RuntimeParserClass } from "../../build/index.js";
import { GetValue, ReadConfigFile } from "../utilities/config.ts";
import { Eval } from "../utilities/eval.ts";
import { Candidate, Stable } from "../utilities/language.ts";
import { MarkdownTable } from "../utilities/logging.ts";
import { type AnalysisOutput, Benchmark } from "../utilities/performance.ts";

const benchmarks: BenchmarkConfig[] = ReadConfigFile(import.meta.dirname, 'benchmark.config.yml');
const suite = [];
for (const benchmark of benchmarks) {
  const { title } = benchmark;
  const defaults = {
    grammar: GetValue(benchmark, 'grammar'),
    input: GetValue(benchmark, 'input'),
    algorithm: benchmark.algorithm,
    compilerOptions: benchmark.compilerOptions,
    parserOptions: benchmark.parserOptions,
    parserIterations: benchmark.parserIterations,
    version: benchmark.version
  }

  const results = [];
  for (const test of benchmark.tests) {
    const { title } = test;
    const grammar = GetValue(test, 'grammar') || defaults.grammar;
    const input = GetValue(test, 'input') || defaults.input;
    const algorithm = test.algorithm || defaults.algorithm;
    const compilerOptions = test.compilerOptions || defaults.compilerOptions;
    const parserOptions = test.parserOptions || defaults.parserOptions;
    const parserIterations = test.parserIterations || defaults.parserIterations || 1;
    const version = test.version || defaults.version;
    results.push({ title, parserIterations, ...await BenchmarkTest(version, grammar, input, algorithm, compilerOptions, parserOptions, parserIterations) })
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  suite.push({ title, results });

  console.log(`### ${title}`);

  const s = MarkdownTable(results, [
    {
      label: '',
      value: 'title'
    },
    {
      label: 'Parsing Cold',
      value: (row) => row.cold.average.toFixed(2)
    },
    {
      label: 'Parsing Hot',
      value: (row) => row.hot.average.toFixed(2)
        + ` (±${row.hot.stdDev.toFixed(2)})`
    },
    {
      label: 'Stability (CV)',
      value: (row) => row.hot.cv
    },
    {
      label: 'Memory Used',
      value: (row) => row.memory
    },
    {
      label: 'Parsing Iterations',
      value: (row) => row.parserIterations
    }
  ]);

  console.log(s);
}


interface BenchmarkConfig {
  title: string;
  version: 'candidate' | 'stable';
  grammar: string;
  input: string;
  algorithm: 'earley';
  compilerOptions?: GeneratorOutputOptions;
  parserOptions?: any;
  parserIterations?: number;
  tests: {
    title: string;
    version: 'candidate' | 'stable';
    grammar: string;
    input: string;
    algorithm: 'earley';
    compilerOptions?: GeneratorOutputOptions;
    parserOptions?: any;
    parserIterations?: number;
  }[]
}


async function BenchmarkTest(
  version: 'candidate' | 'stable' = 'candidate',
  grammar: string,
  input: string,
  algorithm: 'earley' = 'earley',
  compilerOptions: GeneratorOutputOptions = {},
  parserOptions: {} = {},
  parserIterations: number = 1000): Promise<{ hot: AnalysisOutput, cold: AnalysisOutput, output: any, memory: string, error?: any }> {
  try {

    const { Compile, Parse } = version == 'candidate' ? Candidate : Stable;
    const compiling = await Compile(grammar, compilerOptions);

    const parser: RuntimeParserClass = Eval(compiling);
    const parsing = await Benchmark(() => Parse(new parser(), input, { algorithm, parserOptions }), parserIterations);
    delete parsing.output;

    return parsing;
  } catch (error) {
    console.log(error);
    return {
      hot: {
        low: 0,
        high: 0,
        average: 0,
        median: 0,
        stdDev: 0,
        cv: '-'
      },
      cold: {
        low: 0,
        high: 0,
        average: 0,
        median: 0,
        stdDev: 0,
        cv: '-'
      },
      memory: '',
      output: null,
      error
    }
  }
}