body ${
var ws = {literal: " "};
var number = {test: function(n) {
    return n.constructor === Number;
}};
}
grammar {{
    main -> $number ($number $ws $number):+
}}