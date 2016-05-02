# http://www.loc.gov/standards/datetime

@{%

  function num(data) { return Number(data.join('')) }

  function zero() { return 0 }

  function pick(...args) {
    return args.length === 1 ?
      data => data[args[0]] :
      data => concat(data, args)
  }

  function concat(data, idx = data.keys()) {
    return Array.from(idx)
      .reduce((memo, i) => data[i] !== null ? memo.concat(data[i]) : memo, [])
  }

  function merge(...args) {
    return data => args.reduce((a, i) => Object.assign(a, data[i]), {})
  }

%}

edtf -> L0 {% id %}
#     | L1 {% id %}
#     | L2 {% id %}


# --- Level 0 / ISO 8601 Rules ---

L0 -> date      {% id %}
    | datetime  {% id %}

date -> year           {% data => ({ values: data }) %}
      | year_month     {% data => ({ values: data[0] }) %}
      | year_month_day {% data => ({ values: data[0] }) %}

year -> positive_year {% id %}
      | negative_year {% id %}
      | "0000"        {% zero %}

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

datetime -> date "T" time (timezone):?
  {%
    data => ({ values: data[0].values.concat(data[2]), offset: data[3] })
  %}

time -> hours ":" minutes ":" seconds milliseconds {% pick(0, 2, 4, 5) %}
      | "24:00:00"                                 {% () => [24, 0, 0] %}

hours   -> d00_23 {% id %}
minutes -> d00_59 {% id %}
seconds -> d00_59 {% id %}

milliseconds -> null
              | "." digit digit digit {% data => num(data.slice(1)) %}

timezone -> "Z"                 {% zero %}
          | "-" offset          {% data => -data[1] %}
          | "+" positive_offset {% pick(1) %}

positive_offset -> offset  {% id %}
                 | "00:00" {% zero %}

offset -> d01_13 ":" minutes {% data => data[0] * 60 + data[2] %}
        | "14:00"            {% () => 840 %}
        | "00:" d01_59       {% pick(1) %}


# --- Base Definitions ---

digit -> positive_digit {% id %}
       | "0"            {% zero %}

positive_digit -> [1-9] {% num %}

m31 -> ("01"|"03"|"05"|"07"|"08"|"10"|"12") {% data => num(data) - 1 %}
m30 -> ("04"|"06"|"09"|"11")                {% data => num(data) - 1 %}

d01_12 -> "0" positive_digit {% pick(1) %}
        | "1" [0-2]          {% num %}

d01_13 -> d01_12 {% id %}
        | "13"   {% () => 13 %}

d00_23 -> "00"   {% zero %}
        | d01_23 {% id %}

d01_23 -> "0" positive_digit {% pick(1) %}
        | "1" digit          {% num %}
        | "2" [0-3]          {% num %}

d01_29 -> "0" positive_digit {% pick(1) %}
        | [1-2] digit        {% num %}

d01_30 -> d01_29 {% id  %}
        | "30"   {% () => 30 %}

d01_31 -> d01_30 {% id  %}
        | "31"   {% () => 31 %}

d00_59 -> "00"   {% zero %}
        | d01_59 {% id %}

d01_59 -> d01_29      {% id %}
        | [345] digit {% num %}
