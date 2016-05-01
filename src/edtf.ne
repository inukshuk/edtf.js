# http://www.loc.gov/standards/datetime

@{%

  function zero() { return 0; }

  function num(data) { return Number(data.join('')) }

  function pick(...args) {
    return function (data) { return args.map(i => data[i]) }
  }


%}

edtf -> L0 {% id %}
#     | L1 {% id %}
#     | L2 {% id %}


# --- Level 0 / ISO 8601 Rules ---

L0 -> year       {% data => ({ values: data }) %}
    | year_month {% data => ({ values: data[0] }) %}

year -> positive_year {% id %}
      | negative_year {% id %}
      | "0000"        {% zero %}

positive_year -> positive_digit digit digit digit {% num  %}
               | "0" positive_digit digit digit   {% data => num(data.slice(1)) %}
               | "00" positive_digit digit        {% data => num(data.slice(1)) %}
               | "000" positive_digit             {% data => num(data.slice(1)) %}

negative_year -> "-" positive_year {% function (d) { return -d[1] } %}

year_month -> year "-" month {% pick(0, 2) %}

month -> d01_12 {% id %}

# --- Base Definitions ---

d01_12 -> "0" positive_digit {% data => num(data.slice(1)) %}
        | "10"               {% num %}
        | "11"               {% num %}
        | "12"               {% num %}

digit -> positive_digit {% id %}
       | "0"            {% id %}

positive_digit -> [1-9]
