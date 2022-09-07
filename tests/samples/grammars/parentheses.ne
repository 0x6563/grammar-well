grammar {{
  brackets ->
        "(" list? ")" {{ !0 }}
      | "{" list? "}" {{ !0 }}
      | "[" list? "]" {{ !0 }}
      | "<" list? ">" {{ !0 }}

  list->
    brackets
    | brackets list  
}}