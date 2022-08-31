unsigned_int -> [0-9]:+ {%
    function({data}) {
        return parseInt(data[0].join(""));
    }
%}

int -> ("-"|"+"):? [0-9]:+ {%
    function({data}) {
        if (data[0]) {
            return parseInt(data[0][0]+data[1].join(""));
        } else {
            return parseInt(data[1].join(""));
        }
    }
%}

unsigned_decimal -> [0-9]:+ ("." [0-9]:+):? {%
    function({data}) {
        return parseFloat(
            data[0].join("") +
            (data[1] ? "."+data[1][1].join("") : "")
        );
    }
%}

decimal -> "-":? [0-9]:+ ("." [0-9]:+):? {%
    function({data}) {
        return parseFloat(
            (data[0] || "") +
            data[1].join("") +
            (data[2] ? "."+data[2][1].join("") : "")
        );
    }
%}

percentage -> decimal "%" {%
    function({data}) {
        return data[0]/100;
    }
%}

jsonfloat -> "-":? [0-9]:+ ("." [0-9]:+):? ([eE] [+-]:? [0-9]:+):? {%
    function({data}) {
        return parseFloat(
            (data[0] || "") +
            data[1].join("") +
            (data[2] ? "."+data[2][1].join("") : "") +
            (data[3] ? "e" + (data[3][1] || "+") + data[3][2].join("") : "")
        );
    }
%}
