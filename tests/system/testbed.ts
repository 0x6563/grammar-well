import { expect } from "chai";
import { readFileSync } from 'fs';
import { join } from 'path';
import { Compile, Parse, Parser } from '../../src';

export function Expected(actual: any, expected: any, message?: string) {
    if (expected instanceof RegExp) {
        expect(actual).matches(expected, message);
    } else if (typeof expected == 'object') {
        expect(actual).deep.equals(expected, message);
    } else {
        expect(actual).equals(expected, message);
    }
}

export async function AsyncRun(method) {
    let error;
    let result;
    let success = false;
    try {
        result = await method();
        success = true;
    } catch (err) {
        error = err;
    }
    return { error, result, success };
}

export function GetValue(test, prefix) {
    if (test[prefix + 'Source']) {
        return GetFile('../samples/' + test[prefix + 'Source']);
    }

    if (test[prefix + 'JSON'])
        return JSON.parse(GetFile('../samples/' + test[prefix + 'JSON']));

    if (test[prefix + 'Regex'])
        return new RegExp(test[prefix + 'Regex']);

    return test[prefix];
}

export function GetFile(path: string) {
    return readFileSync(join(__dirname, path), 'utf8')
}

export async function Build(grammar) {
    const compiled = await Compile(grammar, { exportName: 'grammar' }) as string;
    const module = { exports: null };
    eval(compiled)
    return module.exports;
}

export async function BuildTest(grammar, input) {
    return Parse(await Build(grammar), input);
}


export async function GrammarWellRunner(source) {
    const compiled = await Compile(source, { exportName: 'grammar' });
    const parser = new Parser(Evalr(compiled));
    return (input) => parser.run(input);
}

export function NearleyRunner(source) {
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

    return (input) => Parse(grammar, input)[0];
}

function Evalr(source) {
    const module = { exports: null };
    eval(source)
    return module.exports;
}