
const { Parser, Compile, Interpreter } = require('../build');

function interpreter(source) {
    const g = nearleyc(source);
    var exports = evalGrammar(g);
    return new Interpreter(exports);
}

function parse(grammar, input) {
    var p = new Parser(grammar);
    p.feed(input);
    return p.results;
}

function nearleyc(source) {
    return Compile(source, { exportName: 'grammar' });
}

function compile(source) {
    var compiledGrammar = nearleyc(source);
    return evalGrammar(compiledGrammar);
}

function evalGrammar(source) {
    var module = { exports: null };
    eval(source)
    return module.exports;
}

module.exports = {
    compile: compile,
    nearleyc: nearleyc,
    evalGrammar: evalGrammar,
    parse: parse,
    interpreter: interpreter
};

