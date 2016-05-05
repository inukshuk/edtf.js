# http://www.loc.gov/standards/datetime

@{%
  const {
    num, zero, pick, join, concat, merge, interval, masked, date, datetime, season
  } = require('./util')

  const {
    DAY, MONTH, YEAR, YMD, YM, MD, YYXX, YYYX, XXXX
  } = require('./bitmask')

%}

# --- Macros ---

pua[X]    -> UA:? $X UA:?


# --- EDTF / ISO 8601-2 ---

edtf -> L0 {% id %}
      | L1 {% id %}
      | L2 {% id %}


# --- EDTF Level 0 / ISO 8601-1 ---

L0 -> date_time {% id %}
    | century   {% id %}
    | L0i       {% id %}


L0i -> date_time "/" date_time {% interval(0) %}

century -> d2 {% data => ({ values: [num(data[0])], type: 'century', level: 0 }) %}

date_time -> date     {% id %}
           | datetime {% id %}

date -> year           {% data => date(data) %}
      | year_month     {% data => date(data[0]) %}
      | year_month_day {% data => date(data[0]) %}

year -> positive_year {% id %}
      | negative_year {% id %}
      | "0000"        {% join %}

positive_year -> positive_digit digit digit digit {% join %}
               | "0" positive_digit digit digit   {% join %}
               | "00" positive_digit digit        {% join %}
               | "000" positive_digit             {% join %}

negative_year -> "-" positive_year {% join %}

year_month -> year "-" month {% pick(0, 2) %}

year_month_day -> year "-" month_day {% pick(0, 2) %}

month -> d01_12 {% id %}

month_day -> m31 "-" day     {% pick(0, 2) %}
           | m30 "-" d01_30  {% pick(0, 2) %}
           | "02" "-" d01_29 {% pick(0, 2) %}

day -> d01_31 {% id %}


# --- ISO 8601-1 Date / Time ---

datetime -> date "T" time (timezone {% id %}):? {% datetime %}

time -> hours ":" minutes ":" seconds milliseconds {% pick(0, 2, 4, 5) %}
      | "24:00:00"                                 {% () => [24, 00, 00] %}

hours   -> d00_23 {% num %}
minutes -> d00_59 {% num %}
seconds -> d00_59 {% num %}

milliseconds -> null
              | "." d3 {% data => num(data.slice(1)) %}

timezone -> "Z"                 {% zero %}
          | "-" offset          {% data => -data[1] %}
          | "+" positive_offset {% pick(1) %}

positive_offset -> offset                  {% id %}
                 | "00:00"                 {% zero %}
                 | ("12"|"13") ":" minutes {% data => num(data[0]) * 60 + data[2] %}
                 | "14:00"                 {% () => 840 %}
                 | d00_14                  {% data => num(data[0]) * 60 %}

offset -> d01_11 ":" minutes {% data => num(data[0]) * 60 + data[2] %}
        | "00:" d01_59       {% data => num(data[1]) %}
        | "12:00"            {% () => 720 %}
        | d01_12             {% data => num(data[0]) * 60 %}


# --- EDTF / ISO 8601-2 Level 1 ---

L1 -> date_ua {% id %}
    | L1X     {% merge(0, { type: 'date', level: 1 }) %}
    | L1Y     {% id %}
    | L1S     {% id %}
    | L1i     {% id %}

date_ua -> date UA  {% merge(0, 1, { level: 1 }) %}


L1i -> L1i_date "/" L1i_date  {% interval(1) %}
     | date_time "/" L1i_date {% interval(1) %}
     | L1i_date "/" date_time {% interval(1) %}

L1i_date -> null     {% () => ({ values: [], type: 'unknown', level: 1 }) %}
          | date_ua  {% id %}
          | "*"      {% () => ({ values: [], type: 'open', level: 1 }) %}


L1X -> d4 "-" md "-XX" {% masked() %}
     | d4 "-XX-XX"     {% masked() %}
     | "XXXX-XX-XX"    {% masked() %}
     | d4 "-XX"        {% masked() %}
     | "XXXX-XX"       {% masked() %}
     | d2 "XX"         {% masked() %}
     | d3 "X"          {% masked() %}
     | "XXXX"          {% masked() %}

L1Y -> "Y" d5+  {% data => date([num(data[1])], 1) %}
     | "Y-" d5+ {% data => date([-num(data[1])], 1) %}


UA -> "?" {% () => ({ uncertain: true }) %}
    | "~" {% () => ({ approximate: true }) %}
    | "%" {% () => ({ approximate: true, uncertain: true }) %}


L1S -> year "-" d21_24 {% data => season(data, 1) %}


# --- EDTF / ISO 8601-2 Level 2 ---

L2 -> pua_date  {% () => ({ type: 'date', level: 2 }) %}
    | L2Y       {% id %}
    | L2X       {% merge(0, { type: 'date', level: 2 }) %}
    | L2S       {% id %}
    | decade    {% id %}
    | decade UA {% merge(0, 1) %}


# NB: these are slow because they match almost everything!
# We could enumerate all possible combinations of qualified
# dates, excluding those covered by level 1. (use macros!)
pua_date -> UA year UA:?
          | pua_year_month
          | pua_year_month_day

pua_year_month -> pua[year] "-" pua[month]

pua_year_month_day -> pua[year] "-" pua_month_day

pua_month_day -> pua[m31] "-" pua[day]
               | pua[m30] "-" pua[d01_30]
               | pua["02"] "-" pua[d01_29]

# NB: these are slow because they match almost everything!
# We could enumerate all possible combinations of unspecified
# dates, excluding those covered by level 1. (use macros!)
L2X -> dx4         {% masked() %}
     | dx4 "-" mx  {% masked() %}
     | dx4 "-" mdx {% masked() %}

mdx -> m31x "-" d31x {% join %}
     | m30x "-" d30x {% join %}
     | "02-" d29x    {% join %}

L2Y -> "Y" exp_year  {% data => date([data[1]], 2) %}
     | "Y-" exp_year {% data => date([-data[1]], 2) %}

exp_year -> digits "E" digits
  {% data => num(data[0]) * Math.pow(10, num(data[2])) %}


L2S -> year "-" d25_39 {% data => season(data, 2) %}

decade -> d3 {% data => ({ values: [num(data)], type: 'decade', level: 2 }) %}


# --- Base Definitions ---

digit -> positive_digit {% id %}
       | "0"            {% id %}

digits -> digit        {% id %}
        | digit digits {% join %}

d4 -> d2 d2       {% join %}
d3 -> d2 digit    {% join %}
d2 -> digit digit {% join %}

d5+ -> positive_digit d3 digits {% num %}

d1x -> [1-9X]  {% id %}
dx  -> d1x     {% id %}
     | "0"     {% id %}
dx2 -> dx dx   {% join %}
dx4 -> dx2 dx2 {% join %}

md  -> m31  {% id %}
     | m30  {% id %}
     | "02" {% id %}

mx  -> "0" d1x      {% join %}
     | [1X] [012X]  {% join %}

m31x -> [0X] [13578X] {% join %}
      | [1X] [02]     {% join %}
      | "1X"          {% id %}

m30x -> [0X] [469]    {% join %}
      | "11"          {% join %}

d29x -> [0-2X] dx     {% join %}
d30x -> d29x          {% join %}
      | "30"          {% id %}
d31x -> d30x          {% id %}
      | "3" [1X]      {% join %}


positive_digit -> [1-9] {% id %}

m31 -> ("01"|"03"|"05"|"07"|"08"|"10"|"12") {% id %}
m30 -> ("04"|"06"|"09"|"11")                {% id %}

d01_11 -> "0" positive_digit {% join %}
        | "1" [0-1]          {% join %}

d01_12 -> d01_11 {% id %}
        | "12"   {% id %}

d01_13 -> d01_12 {% id %}
        | "13"   {% id %}

d00_14 -> "00"   {% id %}
        | d01_13 {% id %}
        | "14"   {% id %}

d00_23 -> "00"   {% id %}
        | d01_23 {% id %}

d01_23 -> "0" positive_digit {% join %}
        | "1" digit          {% join %}
        | "2" [0-3]          {% join %}

d01_29 -> "0" positive_digit {% join %}
        | [1-2] digit        {% join %}

d01_30 -> d01_29 {% id  %}
        | "30"   {% id %}

d01_31 -> d01_30 {% id  %}
        | "31"   {% id %}

d00_59 -> "00"   {% id %}
        | d01_59 {% id %}

d01_59 -> d01_29      {% id %}
        | [345] digit {% join %}

d21_24 -> "2" [1-4] {% join %}

d25_39 -> "2" [5-9] {% join %}
        | "3" digit {% join %}
