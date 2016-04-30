# http://www.loc.gov/standards/datetime

@{%

  function zero() { return 0; }

  function num(d) { return Number(d.join('')) }

  function num1(d) { return Number(d.slice(1).join('')) }

%}

edtf -> L1 {% id %}
#     | L2 {% id %}


# --- Level 1 ---

L1 -> year {% id %}

year -> positive_year {% id %}
      | negative_year {% id %}
      | "0000"        {% zero %}

positive_year -> positive_digit digit digit digit {% num  %}
               | "0" positive_digit digit digit   {% num1 %}
               | "00" positive_digit digit        {% num1 %}
               | "000" positive_digit             {% num1 %}

negative_year -> "-" positive_year {% function (d) { return -d[1] } %}

# --- Base Definitions ---

digit -> positive_digit {% id %}
       | "0"            {% id %}

positive_digit -> [1-9]
