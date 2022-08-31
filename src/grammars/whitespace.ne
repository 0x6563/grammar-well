# Whitespace: `_` is optional, `__` is mandatory.
_  -> wschar:* {% _ => null %}
__ -> wschar:+ {% _ => null %}

wschar -> [\t\n\v\f] {% ({data}) => data[0] %}
