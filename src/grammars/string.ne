# Matches various kinds of string literals

# Double-quoted string
dqstring -> "\"" dstrchar:* "\"" {% function({data}) {return data[1].join(""); } %}
sqstring -> "'"  sstrchar:* "'"  {% function({data}) {return data[1].join(""); } %}
btstring -> "`"  [^`]:*    "`"  {% function({data}) {return data[1].join(""); } %}

dstrchar -> [^\\"\n] {% id %}
    | "\\" strescape {%
    function({data}) {
        return JSON.parse("\""+data.join("")+"\"");
    }
%}

sstrchar -> [^\\'\n] {% id %}
    | "\\" strescape
        {% function({data}) { return JSON.parse("\""+data.join("")+"\""); } %}
    | "\\'"
        {% function({data}) {return "'"; } %}

strescape -> ["\\/bfnrt] {% id %}
    | "u" [a-fA-F0-9] [a-fA-F0-9] [a-fA-F0-9] [a-fA-F0-9] {%
    function({data}) {
        return data.join("");
    }
%}
