
const { readFileSync } = require('fs');
const { Compile, Parser } = require('../../build');
const { join } = require('path');

function GetFile(path) {
    return readFileSync(join(__dirname, path), 'utf8')
}

function GetValue(test, prefix) {

    if (test[prefix + 'Source']) {
        return GetFile('../samples/' + test[prefix + 'Source']);
    }

    if (test[prefix + 'JSON']) {
        return JSON.parse(GetFile('../samples/' + test[prefix + 'JSON']));
    }

    return test[prefix];
}


async function GrammarWellRunner(source) {
    const compiled = await Compile(source, { exportName: 'grammar' });
    const interpreter = new Parser(Evalr(compiled), { algorithm: 'earley' });
    return (input) => interpreter.run(input);
}

function NearleyRunner(source) {
    const { Parser, Grammar } = require('nearley');
    const Compile = require('nearley/lib/compile');
    const Generate = require('nearley/lib/generate');
    const nearleyGrammar = Grammar.fromCompiled(require('nearley/lib/nearley-language-bootstrapped'));

    function Parse(grammar, input) {
        var p = new Parser(grammar);
        p.feed(input);
        return p.results;
    }

    const results = Parse(nearleyGrammar, source);
    const compiled = Compile(results[0], {});
    const generated = Generate(compiled, 'grammar');
    const grammar = new Grammar.fromCompiled(Evalr(generated));

    return (input) => Parse(grammar, input);
}

function Evalr(source) {
    const module = { exports: null };
    eval(source)
    return module.exports;
}


module.exports = { GetFile, GetValue, NearleyRunner, GrammarWellRunner };
