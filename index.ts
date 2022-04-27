import { readFileSync } from "fs";
import { Compile } from "./src/lib/compile";
import { Interpreter } from "./src/lib/interpreter";

const compiled = Compile(readFileSync('./legacy-test/grammars/whitespace.ne', 'utf-8'));
const pre = requireFromString(compiled);

const i = new Interpreter(pre)
// const test = '{ "a" : true, "b" : "䕧⡱a\\\\\\"b\\u4567\\u2871䕧⡱\\t\\r\\f\\b\\n", "c" : null, "d" : [null, true, false, null] }\n';
// const test = '{}'
const test = '(x)'
console.log(i.run(test));

function requireFromString(source) {
    var module = { exports: null };
    eval(source)
    return module.exports;
}
