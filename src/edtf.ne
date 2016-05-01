# http://www.loc.gov/standards/datetime

@{%

  function num(data) { return Number(data.join('')) }

  function pick(...args) {
    return function (data) {
      return args.reduce((a, i) => a.concat(data[i]), [])
    }
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
               | "000" positive_digit             {% data => num(data.slice(1)) %}

negative_year -> "-" positive_year {% data => -data[1] %}

year_month -> year "-" month {% pick(0, 2) %}

month -> d01_12 {% id %}

year_month_day -> year_month "-" day {% pick(0, 2) %}

day -> d01_31 {% id %}

# --- Base Definitions ---

digit -> positive_digit {% id %}
       | "0"            {% id %}

positive_digit -> [1-9] {% id %}

d01_12 -> "0" positive_digit {% data => num(data.slice(1)) %}
        | "10"               {% num %}
        | "11"               {% num %}
        | "12"               {% num %}

d01_29 -> "0" positive_digit {% data => num(data.slice(1)) %}
        | [1-2] digit        {% num %}

d01_30 -> d01_29 {% id  %}
        | "30"   {% num %}

d01_31 -> d01_30 {% id  %}
        | "31"   {% num %}
