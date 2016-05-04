# http://www.loc.gov/standards/datetime

@{%
  const { num, zero, pick, join, concat, merge } = require('./util')
  const { DAY, MONTH, YEAR, YMD, YM, MD, YYXX, YYYX, XXXX } = require('./bitmask')
%}

edtf -> L0 {% id %}
      | L1 {% id %}
#     | L2 {% id %}


# --- EDTF Level 0 / ISO 8601-1 ---

L0 -> date_time {% id %}
    | century   {% id %}
    | L0i       {% id %}


L0i -> date_time "/" date_time
  {%
    data => ({
      values: [data[0], data[2]],
      type: 'interval',
      level: 0
    })
  %}


date_time -> date     {% id %}
           | datetime {% id %}

date -> year           {% data => ({ values: data , type: 'date', level: 0 }) %}
      | year_month     {% data => ({ values: data[0], type: 'date', level: 0 }) %}
      | year_month_day {% data => ({ values: data[0], type: 'date', level: 0 }) %}

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

datetime -> date "T" time (timezone {% id %}):?
  {%
    data => ({
      values: data[0].values.concat(data[2]),
      offset: data[3],
      type: 'datetime',
      level: 0
    })
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

positive_offset -> offset                  {% id %}
                 | "00:00"                 {% zero %}
                 | ("12"|"13") ":" minutes {% data => num(data[0]) * 60 + data[2] %}
                 | "14:00"                 {% () => 840 %}

offset -> d01_11 ":" minutes {% data => data[0] * 60 + data[2] %}
        | "00:" d01_59       {% pick(1) %}
        | "12:00"            {% () => 720 %}

century -> digit digit {% data => ({ values: [num(data)], type: 'century', level: 0 }) %}

# --- EDTF / ISO 8601-2 Level 1 ---

L1 -> date_ua {% id %}
    | L1X     {% merge(0, { type: 'date', level: 1 }) %}
    | L1Y     {% id %}
    | L1S     {% id %}
    | L1i     {% id %}

date_ua -> date UA  {% merge(0, 1, { level: 1 }) %}

L1i -> L1i_date "/" L1i_date
  {%
    data => ({
      values: [data[0], data[2]],
      type: 'interval',
      level: 1
    })
  %}

L1i_date -> null     {% () => ({ type: 'unknown', level: 1 }) %}
          | date_ua  {% id %}
          | "*"      {% () => ({ type: 'open', level: 1 }) %}


L1X -> year_month "-XX"      {% data => ({ values: data[0], unspecified: DAY }) %}
     | year "-XX-XX"         {% data => ({ values: [data[0]], unspecified: MD }) %}
     | "XXXX-XX-XX"          {% data => ({ values: [], unspecified: YMD }) %}
     | year "-XX"            {% data => ({ values: [data[0]], unspecified: MONTH }) %}
     | "XXXX-XX"             {% data => ({ values: [], unspecified: YM }) %}
     | digit digit "XX"      {% data => ({ values: [num(data.slice(0, 2)) * 100], unspecified: YYXX }) %}
     | digit digit digit "X" {% data => ({ values: [num(data.slice(0, 3)) * 10], unspecified: YYYX }) %}
     | "XXXX"                {% data => ({ values: [], unspecified: XXXX }) %}

L1Y -> "Y" d5+  {% data => ({ values: [data[1]], type: 'date', level: 1 }) %}
L1Y -> "Y-" d5+ {% data => ({ values: [-data[1]], type: 'date', level: 1 }) %}

d5+ -> positive_digit digit digit digit digits {% num %}

UA -> "?" {% () => ({ uncertain: true }) %}
    | "~" {% () => ({ approximate: true }) %}
    | "%" {% () => ({ approximate: true, uncertain: true }) %}


L1S -> year "-" d21_24 {% data => ({ values: [data[0], data[2]], type: 'season', level: 1 }) %}

# --- EDTF / ISO 8601-2 Level 2 ---

#decade -> digit digit {% data => ({ values: [num(data)], type: 'decade', level: 2 }) %}
#L1S -> year "-" d25_39 {% data => ({ values: [data[0], data[2]], type: 'season', level: 2 }) %}

# --- Base Definitions ---

digit -> positive_digit {% id %}
       | "0"            {% zero %}

digits -> digit        {% id %}
        | digit digits {% join %}

positive_digit -> [1-9] {% num %}

m31 -> ("01"|"03"|"05"|"07"|"08"|"10"|"12") {% data => num(data) - 1 %}
m30 -> ("04"|"06"|"09"|"11")                {% data => num(data) - 1 %}

d01_11 -> "0" positive_digit {% pick(1) %}
        | "1" [0-1]          {% num %}

d01_12 -> d01_11 {% id %}
        | "12"   {% () => 12 %}

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

d21_24 -> "2" [1-4] {% num %}

d25_39 -> "2" [5-9] {% num %}
        | "3" digit {% num %}
