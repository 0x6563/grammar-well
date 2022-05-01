
const { Compile, Interpreter } = require('../build');

function compile(source) {
    const compiled = Compile(source, { exportName: 'grammar' });
    const module = { exports: null };
    eval(compiled)
    return module.exports;
}

function interpreter(source) {
    return new Interpreter(compile(source));
}

function parse(grammar, input) {
    var p = new Interpreter(grammar);
    p.feed(input);
    return p.results;
}

module.exports = { compile, parse, interpreter };

