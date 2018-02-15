# http://www.loc.gov/standards/datetime

@{%
  const {
    num, zero, nothing, pick, pluck, join, concat, merge, century,
    interval, list, masked, date, datetime, season, qualify, year, decade
  } = require('./util')

  const {
    DAY, MONTH, YEAR, YMD, YM, MD, YYXX, YYYX, XXXX
  } = require('./bitmask')
%}


# --- EDTF / ISO 8601-2 ---

edtf -> L0 {% id %}
      | L1 {% id %}
      | L2 {% id %}
      | L3 {% id %}


# --- EDTF Level 0 / ISO 8601-1 ---

L0 -> date_time {% id %}
    | century   {% id %}
    | L0i       {% id %}


L0i -> date_time "/" date_time {% interval(0) %}

century -> positive_century     {% data => century(data[0]) %}
         | "00"                 {% data => century(0) %}
         | "-" positive_century {% data => century(-data[1]) %}

positive_century -> positive_digit digit {% num %}
                  | "0" positive_digit   {% num %}


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

datetime -> year_month_day "T" time (timezone {% id %}):? {% datetime %}

time -> hours ":" minutes ":" seconds milliseconds {% pick(0, 2, 4, 5) %}
      | "24:00:00"                                 {% () => [24, 0, 0] %}

hours   -> d00_23 {% num %}
minutes -> d00_59 {% num %}
seconds -> d00_59 {% num %}

milliseconds -> null
              | "." d3 {% data => num(data.slice(1)) %}

timezone -> "Z"                 {% zero %}
          | "-" offset          {% data => -data[1] %}
          | "+" positive_offset {% pick(1) %}

positive_offset
  -> offset                  {% id %}
   | "00:00"                 {% zero %}
   | ("12"|"13") ":" minutes {% data => num(data[0]) * 60 + data[2] %}
   | "14:00"                 {% () => 840 %}
   | d00_14                  {% data => num(data[0]) * 60 %}

offset -> d01_11 ":" minutes {% data => num(data[0]) * 60 + data[2] %}
        | "00:" d01_59       {% data => num(data[1]) %}
        | "12:00"            {% () => 720 %}
        | d01_12             {% data => num(data[0]) * 60 %}


# --- EDTF / ISO 8601-2 Level 1 ---

L1 -> L1d {% id %}
    | L1Y {% id %}
    | L1S {% id %}
    | L1i {% id %}

L1d -> date_ua {% id %}
     | L1X     {% merge(0, { type: 'Date', level: 1 }) %}

date_ua -> date UA  {% merge(0, 1, { level: 1 }) %}


L1i -> L1i_date "/" L1i_date  {% interval(1) %}
     | date_time "/" L1i_date {% interval(1) %}
     | L1i_date "/" date_time {% interval(1) %}

L1i_date -> null     {% nothing %}
          | date_ua  {% id %}
          | INFINITY {% id %}

INFINITY -> "*" {% () => Infinity %}

L1X -> nd4 "-" md "-XX" {% masked() %}
     | nd4 "-XX-XX"     {% masked() %}
     | "XXXX-XX-XX"     {% masked() %}
     | nd4 "-XX"        {% masked() %}
     | "XXXX-XX"        {% masked() %}
     | nd2 "XX"         {% masked() %}
     | nd3 "X"          {% masked() %}
     | "XXXX"           {% masked() %}

L1Y -> "Y" d5+  {% data => year([num(data[1])], 1) %}
     | "Y-" d5+ {% data => year([-num(data[1])], 1) %}


UA -> "?" {% () => ({ uncertain: true }) %}
    | "~" {% () => ({ approximate: true }) %}
    | "%" {% () => ({ approximate: true, uncertain: true }) %}


L1S -> year "-" d21_24 {% data => season(data, 1) %}


# --- EDTF / ISO 8601-2 Level 2 ---

L2 -> L2d        {% id %}
    | L2Y        {% id %}
    | L2S        {% id %}
    | L2D        {% id %}
    | L2i        {% id %}
    | set        {% id %}
    | list       {% id %}

L2d -> ua_date   {% id %}
     | L2X       {% merge(0, { type: 'Date', level: 2 }) %}

L2D -> decade    {% id %}
     | decade UA {% merge(0, 1) %}

# NB: these are slow because they match almost everything!
# We could enumerate all possible combinations of qualified
# dates, excluding those covered by level 1.
ua_date -> ua_year           {% qualify %}
         | ua_year_month     {% qualify %}
         | ua_year_month_day {% qualify %}

# TODO: do not allow the same symbol on both sides!
ua[X] -> UA:? $X UA:?

# TODO: how to handle negative years? ?-1900 or -?1900

ua_year -> UA year {% data => [data] %}

ua_year_month -> ua[year] "-" ua[month] {% pluck(0, 2) %}

ua_year_month_day -> ua[year] "-" ua_month_day
  {% data => [data[0], ...data[2]] %}

ua_month_day -> ua[m31] "-" ua[day]     {% pluck(0, 2) %}
              | ua[m30] "-" ua[d01_30]  {% pluck(0, 2) %}
              | ua["02"] "-" ua[d01_29] {% pluck(0, 2) %}

# NB: these are slow because they match almost everything!
# We could enumerate all possible combinations of unspecified
# dates, excluding those covered by level 1.
L2X -> dx4         {% masked() %}
     | dx4 "-" mx  {% masked() %}
     | dx4 "-" mdx {% masked() %}

mdx -> m31x "-" d31x {% join %}
     | m30x "-" d30x {% join %}
     | "02-" d29x    {% join %}


L2i -> L2i_date "/" L2i_date  {% interval(2) %}
     | date_time "/" L2i_date {% interval(2) %}
     | L2i_date "/" date_time {% interval(2) %}

L2i_date -> null     {% nothing %}
          | ua_date  {% id %}
          | L2X      {% id %}
          | INFINITY {% id %}

L2Y -> exp_year                    {% id %}
     | exp_year significant_digits {% merge(0, 1) %}
     | L1Y significant_digits      {% merge(0, 1, { level: 2 }) %}
     | year significant_digits     {% data => year([data[0]], 2, data[1]) %}

significant_digits -> "S" positive_digit
  {% data => ({ significant: num(data[1]) }) %}

exp_year -> "Y" exp  {% data => year([data[1]], 2) %}
          | "Y-" exp {% data => year([-data[1]], 2) %}

exp -> digits "E" digits
  {% data => num(data[0]) * Math.pow(10, num(data[2])) %}


L2S -> year "-" d25_41 {% data => season(data, 2) %}

decade -> positive_decade     {% data => decade(data[0]) %}
        | "000"               {% () => decade(0) %}
        | "-" positive_decade {% data => decade(-data[1]) %}

positive_decade -> positive_digit digit digit {% num %}
                 | "0" positive_digit digit   {% num %}
                 | "00" positive_digit        {% num %}

set  -> LSB OL RSB {% list %}
list -> LLB OL RLB {% list %}


LSB -> "["   {% () => ({ type: 'Set' }) %}
     | "[.." {% () => ({ type: 'Set', earlier: true }) %}
LLB -> "{"   {% () => ({ type: 'List' }) %}

RSB -> "]"   {% nothing %}
     | "..]" {% () => ({ later: true }) %}
RLB -> "}"   {% nothing %}

OL -> LI            {% data => [data[0]] %}
    | OL _ "," _ LI {% data => [...data[0], data[4]] %}

LI -> date         {% id %}
    | ua_date      {% id %}
    | L2X          {% id %}
    | consecutives {% id %}

consecutives
  -> year_month_day ".." year_month_day {% d => [date(d[0]), date(d[2])] %}
   | year_month ".." year_month         {% d => [date(d[0]), date(d[2])] %}
   | year ".." year                     {% d => [date([d[0]]), date([d[2]])] %}


# --- Level 3 / Non-Standard Features ---

L3 -> L3i        {% id %}

L3i -> L3S "/" L3S       {% interval(3) %}

L3S -> L1S {% id %}
     | L2S {% id %}


# --- Base Definitions ---

digit -> positive_digit {% id %}
       | "0"            {% id %}

digits -> digit        {% id %}
        | digits digit {% join %}

nd4 -> d4
     | "-" d4     {% join %}

nd3 -> d3
     | "-" d3     {% join %}

nd2 -> d2
     | "-" d2     {% join %}

d4 -> d2 d2       {% join %}
d3 -> d2 digit    {% join %}
d2 -> digit digit {% join %}

d5+ -> positive_digit d3 digits {% num %}

d1x -> [1-9X]  {% id %}
dx  -> d1x     {% id %}
     | "0"     {% id %}
dx2 -> dx dx   {% join %}

dx4 -> dx2 dx2      {% join %}
     | "-" dx2 dx2  {% join %}

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

d29x -> "0" d1x       {% join %}
      | [1-2X] dx     {% join %}
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

d25_41 -> "2" [5-9] {% join %}
        | "3" digit {% join %}
        | "4" [01]  {% join %}

_ -> " ":*
