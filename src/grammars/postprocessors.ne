# Simple postprocessors

# Postprocessor generator that lets you select the nth element of the list.
# `id` is equivalent to nth(0).
@{%
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function nth(n) {
    return function(({data})) {
        return data[n];
    };
}
%}

# Postprocessor generator that lets you generate an object dynamically.
@{%
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function $(o) {
    return function({data}) {
        var ret = {};
        Object.keys(o).forEach(function(k) {
            ret[k] = data[o[k]];
        });
        return ret;
    };
}
%}

# A separated list of elements.

delimited[el, delim] -> $el ($delim $el {% nth(1) %}):* {%
    function({data}) {
        return [data[0]].concat(data[1]);
    }
%}
