#!/usr/bin/env node

import { createReadStream, createWriteStream } from "fs";
import { Compile } from "./compile";
import { generate } from "./generate";
import { lint } from "./lint";
import { Grammar, Parser } from "./nearley";
import { StreamWrapper } from "./stream";

const opts = require('commander');
const version = require('../package.json').version;

opts.version(version, '-v, --version')
    .arguments('<file.ne>')
    .option('-o, --out [filename.js]', 'File to output to (defaults to stdout)', false)
    .option('-e, --export [name]', 'Variable to set parser to', 'grammar')
    .option('-q, --quiet', 'Suppress linter')
    .option('--nojs', 'Do not compile postprocessors')
    .parse(process.argv);


const input: any = opts.args[0] ? createReadStream(opts.args[0]) : process.stdin;
const output: any = opts.out ? createWriteStream(opts.out) : process.stdout;

const parserGrammar = Grammar.fromCompiled(require('./nearley-language-bootstrapped.js'));
const parser = new Parser(parserGrammar);

input
    .pipe(new StreamWrapper(parser))
    .on('finish', function () {
        parser.feed('\n');
        const c = Compile(
            parser.results[0],
            Object.assign({ version: version }, opts)
        );
        if (!opts.quiet) lint(c, { 'out': process.stderr, 'version': version })
        output.write(generate(c, opts.export));
    });
