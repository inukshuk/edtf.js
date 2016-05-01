# http://www.loc.gov/standards/datetime

@{%

  function num(data) { return Number(data.join('')) }

  function pick(...args) {
    return args.length === 1 ?
      data => data[args[0]] :
      data => args.reduce((a, i) => a.concat(data[i]), [])
  }


%}

edtf -> L0 {% id %}
#     | L1 {% id %}
#     | L2 {% id %}


# --- Level 0 / ISO 8601 Rules ---

L0 -> year           {% data => ({ values: data }) %}
    | year_month     {% data => ({ values: data[0] }) %}
    | year_month_day {% data => ({ values: data[0] }) %}

year -> positive_year {% id %}
      | negative_year {% id %}
      | "0000"        {% () => 0 %}

positive_year -> positive_digit digit digit digit {% num  %}
               | "0" positive_digit digit digit   {% data => num(data.slice(1)) %}
               | "00" positive_digit digit        {% data => num(data.slice(1)) %}
               | "000" positive_digit             {% pick(1) %}

negative_year -> "-" positive_year {% data => -data[1] %}

year_month -> year "-" month {% pick(0, 2) %}

month -> d01_12 {% data => data[0] - 1 %}

year_month_day -> year "-" month_day {% pick(0, 2) %}

month_day -> m31 "-" day    {% pick(0, 2) %}
           | m30 "-" d01_30 {% pick(0, 2) %}
           | "02-" d01_29   {% data => [1, data[1]] %}

day -> d01_31 {% id %}


# --- Base Definitions ---

digit -> positive_digit {% id %}
       | "0"            {% num %}

positive_digit -> [1-9] {% num %}

m31 -> ("01"|"03"|"05"|"07"|"08"|"10"|"12") {% data => num(data) - 1 %}
m30 -> ("04"|"06"|"09"|"11")                {% data => num(data) - 1 %}

d01_12 -> "0" positive_digit {% pick(1) %}
        | "10"               {% num %}
        | "11"               {% num %}
        | "12"               {% num %}

d01_29 -> "0" positive_digit {% pick(1) %}
        | [1-2] digit        {% num %}

d01_30 -> d01_29 {% id  %}
        | "30"   {% num %}

d01_31 -> d01_30 {% id  %}
        | "31"   {% num %}
