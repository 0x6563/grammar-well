---
title: Tokenizers
---

By default, nearley splits the input into a stream of characters. This is
called *scannerless* parsing.

A tokenizer splits the input into a stream of larger units called *tokens*.
This happens in a separate stage before parsing. For example, a tokenizer might
convert `512 + 10` into `["512", "+", "10"]`: notice how it removed the
whitespace, and combined multi-digit numbers into a single number.

Using a tokenizer has many benefits. It...

- ...often makes your parser faster by more than an order of magnitude.
- ...allows you to write cleaner, more maintainable grammars.
- ...helps avoid ambiguous grammars in some cases. For example, a tokenizer can
  easily tell you that `superclass` is a single keyword, not a sequence of
  `super` and `class` keywords.
- ...gives you *lexical information* such as line numbers for each token. This
  lets you make better error messages.


### Lexing with Moo

The `@lexer` directive instructs Nearley to use a lexer you've defined inside a
[Javascript block](grammar#additional-js) in your grammar.

nearley supports and recommends [Moo](https://github.com/tjvr/moo), a
super-fast lexer. Construct a lexer using `moo.compile`.

When using a lexer, there are two ways to match tokens:

  - Use `%token` to match a token with **type** `token`.

    ```ne
    line -> words %newline
    ```

  - Use `"foo"` to match a token with **text** `foo`.

    This is convenient for matching keywords:

    ```ne
    ifStatement -> "if" condition "then" block
    ```

Here is an example of a simple grammar:

```ne
@{%
const moo = require("moo");

const lexer = moo.compile({
  ws:     /[ \t]+/,
  number: /[0-9]+/,
  word: { match: /[a-z]+/, type: moo.keywords({ times: "x" }) },
  times:  /\*/
});
%}

# Pass your lexer object using the @lexer option:
@lexer lexer

expr -> multiplication {% id %} | trig {% id %}

# Use %token to match any token of that type instead of "token":
multiplication -> %number %ws %times %ws %number {% ([first, , , , second]) => first * second %}

# Literal strings now match tokens with that text:
trig -> "sin" %ws %number {% ([, , x]) => Math.sin(x) %}
```

Have a look at [the Moo documentation](https://github.com/tjvr/moo#usage) to
learn more about writing a tokenizer.

You use the parser as usual: call `parser.feed(data)`, and nearley will give
you the parsed results in return.


### Custom lexers

nearley recommends using a [moo](https://github.com/tjvr/moo)-based lexer.
However, you can use any lexer that conforms to the following interface:

- `next()` returns a token object, which could have fields for line number,
  etc. Importantly, a token object *must* have a `value` attribute.
- `save()` returns an info object that describes the current state of the
  lexer. nearley places no restrictions on this object.
- `reset(chunk, info)` sets the internal buffer of the lexer to `chunk`, and
  restores its state to a state returned by `save()`.
- `formatError(token)` returns a string with an error message describing a
  parse error at that token (for example, the string might contain the line and
  column where the error was found).
- `has(name)` returns true if the lexer can emit tokens with that name. This is
  used to resolve `%`-specifiers in compiled nearley grammars.

> Note: if you are searching for a lexer that allows indentation-aware
> grammars (like in Python), you can still use moo. See [this
> example](https://gist.github.com/nathan/d8d1adea38a1ef3a6d6a06552da641aa) or
> the
> [moo-indentation-lexer](https://www.npmjs.com/package/moo-indentation-lexer)
> module.


### Custom token matchers

Aside from the lexer infrastructure, nearley provides a lightweight way to
parse arbitrary streams.

Custom matchers can be defined in two ways: *literal* tokens and *testable*
tokens. A literal token matches a JS value exactly (with `===`), while a
testable token runs a predicate that tests whether or not the value matches.

Note that in this case, you would feed a `Parser` instance an *array* of
objects rather than a string! Here is a simple example:

```ne
@{%
const tokenPrint = { literal: "print" };
const tokenNumber = { test: x => Number.isInteger(x) };
%}

main -> %tokenPrint %tokenNumber ";;"

# parser.feed(["print", 12, ";", ";"]);
```
