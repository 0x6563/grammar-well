
const { Grammar, Parser, Compile, Interpreter } = require('../build');

function interpreter(source) {
    const g = nearleyc(source);
    var exports = requireFromString(g);
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
    var module = { exports: null };
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
    interpreter: interpreter
};

