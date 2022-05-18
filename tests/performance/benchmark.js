const { add, cycle, complete, suite } = require('benny');
const { parse } = require('yaml');
const { GetValue, NearleyRunner, GrammarWellRunner, GetFile } = require('./testbed');
const benchmarks = parse(GetFile('./samples.yml'));

for (const benchmark of benchmarks) {
  const { title } = benchmark;
  const grammar = GetValue(benchmark, 'grammar');
  const sample = GetValue(benchmark, 'input')
  suite(title,
    add('Nearley', () => {
      const runner = NearleyRunner(grammar);
      return () => runner(sample);
    }),
    add('Grammar Well', async () => {
      const runner = await GrammarWellRunner(grammar);
      return () => runner(sample);
    }),
    cycle(),
    complete()
  );

}
