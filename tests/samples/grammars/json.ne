head : ${

    function extractPair(kv, output) {
        if(kv[0]) { output[kv[0]] = kv[1]; }
    }

    function extractObject({data}) {
        let output = {};

        extractPair(data[2], output);

        for (let i in data[3]) {
            extractPair(data[3][i][3], output);
        }

        return output;
    }

    function extractArray({data}) {
        let output = [data[2]];

        for (let i in data[3]) {
            output.push(data[3][i][3]);
        }

        return output;
    }
}

lexer : {{
    start: "start"

    start ->
        - when: /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/ type: "number"
        - when: /"(?:\\["bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"/ type: "string"
        - when: /\s+/ type: "space"
        - when: "{" type: "{"
        - when: "}" type: "}"
        - when: "[" type: "["
        - when: "]" type: "]"
        - when: "," type: ","
        - when: ":" type: ":"
        - when: "true" type: "true"
        - when: "false" type: "false"
        - when: "null" type: "null"
}}

grammar : {{
    json -> _ (object | array) _ : {{ $1[0] }}

    object -> "{" _ "}" : {{ {} }}
        | "{" _ pair (_ "," _ pair)* _ "}" : ${ extractObject }

    array -> "[" _ "]" : {{ [] }}
        | "[" _ value (_ "," _ value)* _ "]" : ${ extractArray }

    value ->
        object : {{ $0 }}
        | array : {{ $0 }}
        | number : {{ $0 }}
        | string : {{ $0 }}
        | "true" : {{ true }}
        | "false" : {{ false }}
        | "null" : {{ null }}

    number -> $number : {{ parseFloat($0.value) }}

    string -> $string : {{ JSON.parse($0.value) }}

    pair -> key _ ":" _ value : {{ [$0, $4] }}

    key -> string : {{ $0 }}

    _ -> $space? : {{ null }}
}}