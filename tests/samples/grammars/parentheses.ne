# Test for balancing parentheses, brackets, square brackets and pairs of "<" ">"

P ->
      "(" E ")" {% _ => !0 %}
    | "{" E "}" {% _ => !0 %}
    | "[" E "]" {% _ => !0 %}
    | "<" E ">" {% _ => !0 %}

E ->
      null
    | "(" E ")" E
    | "{" E "}" E
    | "[" E "]" E
    | "<" E ">" E
