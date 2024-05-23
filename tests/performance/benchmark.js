import { add, complete, cycle, suite } from 'benny';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { parse } from 'yaml';
import { GetFile, GetValue, GrammarWellRunner } from './testbed';

const benchmarks = parse(GetFile('./samples.yml'));
const results = [];
for (const benchmark of benchmarks) {
  const { title } = benchmark;
  const grammar = GetValue(benchmark, 'grammar');
  const sample = GetValue(benchmark, 'input')
  results.push(suite(title,
    add('Grammar Well', async () => {
      const runner = await GrammarWellRunner(grammar);
      return () => runner(sample);
    }),
    cycle(),
    complete(),
  ));
}

Promise
  .all(results)
  .then(results => {
    const lines = [['', 'Nearley', 'Grammar Well', 'Results']];
    const widths = [0, 0, 0];
    let text = '';

    for (const result of results) {
      const a = result.results[0].ops;
      const b = result.results[1].ops;
      const d = ((b - a) / ((b + a) / 2)) * 100;
      lines.push([
        result.name,
        FormatResult(result.results[0]),
        FormatResult(result.results[1]),
        `${a < b ? '+' : ''}${d.toFixed(2)}%`
      ]);
    }

    for (const l of lines) {
      widths[0] = Math.max(widths[0], l[0].length);
      widths[1] = Math.max(widths[1], l[1].length);
      widths[2] = Math.max(widths[2], l[2].length);
      widths[3] = Math.max(widths[2], l[3].length);
    }
    text += MakeLine(lines[0], widths, ' ');
    text += '\n' + MakeLine(['', '', '', ''], widths, '-');
    for (let i = 1; i < lines.length; i++) {
      text += '\n' + MakeLine(lines[i], widths, ' ');
    }
    let readme = readFileSync(join(__dirname, '../../README.md'), 'utf-8').replace(/## benchmarks[\s\S]*/gmi, '')
    readme += '## Benchmarks\n';
    readme += text;
    writeFileSync(join(__dirname, '../../README.md'), readme, 'utf-8');
  });

function MakeLine(content, widths, fill) {
  let s = '|';
  for (let i = 0; i < content.length; i++) {
    s += MakeCell(content[i], widths[i], fill) + '|';
  }
  return s
};

function MakeCell(content, width, fill) {
  return `${fill}${content.padStart(width, fill)}${fill}`;
}

function FormatResult(result) {
  return `${result.ops} (±${result.margin} x ${result.samples})`
}