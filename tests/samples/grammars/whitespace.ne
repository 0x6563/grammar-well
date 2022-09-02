import whitespace
grammar {{
   d -> a {{ $0 }}

   a -> b _ "&" 
      | b

   b -> letter
      | "(" _ d _ ")"

   letter -> [a-z] {{ $0 }}
}}