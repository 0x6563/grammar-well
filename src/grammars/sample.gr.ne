import "awe"
import lexerString

head ${
	js
}
body ${ js }
body "a"
config {{
	some: "a"
	some1: "b"
}}

lexer {{
	config: main
	test:2

	main ->
		default: "a"
		unmatched:"invalid"
		- import: string, strgin
		- when: /ae/ type: "string" 
		- when:"a" type: "a"
		- when:"b" type: "b"
		- when:"c" type: "c"
		- when:"d" type: "d"

	string ->
		default: "a"
		- import: string, strgin
		- when:"a" type: "string" 
		- when:"a" type: "a"
		- when:"b" type: "b"
		- when:"c" type: "c"
		- when:"d" type: "d"

	string2 ->
		- import: string
		- when: "a" 
			type: "string" 
			goto: main
			pop: all
			inset
		- when:"a" type: "a" inset: 1
		- when:"c" type: "c" set: main
		- when:"d" type: "d" pop: 1 goto: main
		- when:"d" type: "d" pop goto: main
	
}}

grammar {{
	test: waea
	
	state_list -> state

	expr ->
		expr_member {{ [$0] }}
		| expr ws expr_member ${ js }

}}