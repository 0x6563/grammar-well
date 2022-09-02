# mainly for profiling

head ${
/* This comment should exist. */
var f = 0;
}

grammar {{

p -> "(" p ")" | [a-z] q {{ 1 }}
q -> null
    | q ("c" "ow")
}}