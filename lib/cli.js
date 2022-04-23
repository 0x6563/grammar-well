#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var compile_1 = require("./compile");
var generate_1 = require("./generate");
var lint_1 = require("./lint");
var nearley_1 = require("./nearley");
var stream_1 = require("./stream");
var opts = require('commander');
var version = require('../package.json').version;
opts.version(version, '-v, --version')
    .arguments('<file.ne>')
    .option('-o, --out [filename.js]', 'File to output to (defaults to stdout)', false)
    .option('-e, --export [name]', 'Variable to set parser to', 'grammar')
    .option('-q, --quiet', 'Suppress linter')
    .option('--nojs', 'Do not compile postprocessors')
    .parse(process.argv);
var input = opts.args[0] ? fs_1.createReadStream(opts.args[0]) : process.stdin;
var output = opts.out ? fs_1.createWriteStream(opts.out) : process.stdout;
var parserGrammar = nearley_1.Grammar.fromCompiled(require('./nearley-language-bootstrapped.js'));
var parser = new nearley_1.Parser(parserGrammar);
input
    .pipe(new stream_1.StreamWrapper(parser))
    .on('finish', function () {
    parser.feed('\n');
    var c = compile_1.Compile(parser.results[0], Object.assign({ version: version }, opts));
    if (!opts.quiet)
        lint_1.lint(c, { 'out': process.stderr, 'version': version });
    output.write(generate_1.generate(c, opts.export));
});
//# sourceMappingURL=cli.js.map