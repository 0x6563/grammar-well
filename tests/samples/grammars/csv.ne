# csv.ne
# from the Antlr grammar at: http://www.antlr3.org/grammar/list.html
# see also: https://github.com/antlr/grammars-v4


file              -> header newline rows             {{ { header: $0, rows: $2 } }}

header            -> row                             {{ $0 }}

rows              -> row
                   | rows newline row                {% $0.concat([$2]) %}

row               -> field
                   | row "," field                   {% $0.concat([$2]) %}

field             -> unquoted_field                  {{ $0 }}
                   | "\"" quoted_field "\""          {{ $1 }}

quoted_field      -> null                            {{ "" }}
                   | quoted_field quoted_field_char  {% $0.concat($1) %}

quoted_field_char -> [^"]                            {{ $0 }}
                   | "\"" "\""                       {{ "\"" }}

unquoted_field    -> null                            {{ "" }}
                   | unquoted_field char             {% $0.concat($1) %}

char              -> [^\n\r",]                       {{ $0 }}

newline           -> "\r" "\n"                       {{ [] }}
                   | "\r" | "\n"                     {{ [] }}
