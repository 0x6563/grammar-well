
var path = require('path');

const { Grammar, Parser } = require('../lib/nearley');
const {generate} = require('../lib/generate');
const { Compile } = require('../lib/compile');
var parserGrammar = Grammar.fromCompiled(require('../lib/nearley-language-bootstrapped'));

function parse(grammar, input) {
    var p = new Parser(grammar);
    p.feed(input);
    return p.results;
}

function nearleyc(source) {
    // parse
    var results = parse(parserGrammar, source);

    // compile
    var c = Compile(results[0], {});

    // generate
    return generate(c, 'grammar');
}

function compile(source) {
    var compiledGrammar = nearleyc(source);

    // eval
    return evalGrammar(compiledGrammar);
}

/*
function requireFromString(source) {
    var filename = '.'
    var Module = module.constructor;
    var m = new Module();
    m.paths = Module._nodeModulePaths(path.dirname(filename))
    m._compile(source, filename);
    return m.exports;
}
*/
function requireFromString(source) {
    var module = {exports: null};
    eval(source)
    return module.exports;
}

function evalGrammar(compiledGrammar) {
    var exports = requireFromString(compiledGrammar);
    return new Grammar.fromCompiled(exports);
}

module.exports = {
    compile: compile,
    nearleyc: nearleyc,
    evalGrammar: evalGrammar,
    parse: parse,
};

