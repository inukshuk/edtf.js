# EDTF.js

![Build Status](https://github.com/inukshuk/edtf.js/actions/workflows/ci.yml/badge.svg?branch=main)
[![codecov](https://codecov.io/gh/inukshuk/edtf.js/branch/main/graph/badge.svg?token=AL1EwOHlfd)](https://codecov.io/gh/inukshuk/edtf.js)
[![NPM version](https://img.shields.io/npm/v/edtf.svg)](https://www.npmjs.com/package/edtf)

An Extended Date Time Format (EDTF) / ISO 8601-2 parser and toolkit for
date/time hackers and enthusiasts.

## Compatibility

### EDTF / ISO 8601-2
EDTF.js fully implements [EDTF](http://www.loc.gov/standards/datetime)
levels 0, 1, and 2 as specified by ISO 8601-2 with the following
exceptions:

1. Seasons in intervals are supported at the experimental/non-standard
   level 3. To enable season intervals, enable `seasonIntervals` in
   `defaults` or when passing constraints to the parse function.
2. Uncertain or approximate seasons as well as seasons with unspecifed
   years are supported at the experimental/non-standard level 3.
   To enable this feature, set `seasonUncertainty` in `defaults`
   or when passing constraints to the parse function.

To enable all experimental/non-standard features
you can also set the `level` to 3 in `defaults` or when passing
parser constraints.

### ESM
Since version 4.0 EDTF.js uses Nodes.js native ESM module implementation.
Since version 4.1 EDTF.js is published as a dual-package.


## Installation
    $ npm install edtf


## Manual

EDTF.js exports a top-level function which takes either a string
(with optional parser constraints), a parse result, a regular or any
of the extended date objects and returns a new, extended date object
as appropriate.

    import edtf, { Date, Interval } from 'edtf'

    edtf('2016-XX')          #-> returns a EDTF Date
    edtf(new Date())         #-> returns a EDTF Date
    edtf('2016-04~/2016-05') #-> returns a EDTF Interval

For a list of all types supported by EDTF.js see:

    import * as types from 'edtf/types'
    Object.keys(types)
    #-> ['Date', 'Year', 'Decade', 'Century', 'Season', 'Interval', 'List', 'Set']

Each type provides at least the following properties: the date's
corresponding EDTF string, its minimum and maximum numeric value,
its type, as well as its date part values.

    edtf('2016?').edtf         #-> '2016?'

    edtf('2016-02').min        #-> 1454284800000, i.e. 2016-02-01T00:00:00Z
    edtf('2016-02').max        #-> 1456790399999, i.e. 2016-02-29T23:59:59Z

    edtf('2016-02-2X').min     #-> 1455926400000, i.e. 2016-02-20T00:00:00Z
    edtf('2016-02-2X').max     #-> 1456790399999, i.e. 2016-02-29T23:59:59Z

    edtf('[..2016,2017]').min  #-> -Infinity
    edtf('[..2016,2017]').max  #-> 1514764799999, i.e. 2017-12-31T23:59:59Z

    edtf('2016-34').min        #-> 1459468800000, i.e. 2016-04-01T00:00:00Z
    edtf('2016-34').max        #-> 1467331199999, i.e. 2016-06-30T23:59:59Z

    edtf('2016?-02').values    #-> [2016, 1]
    edtf('2016-05').values     #-> [2016, 4]

A date's `min` value is also used as its primitive value for numeric
coercion. Because this is the case for all EDTF.js classes, comparison
semantics tend to align well with common-sense expectations -- but be
careful, as always, when type coercion is at play.

### Unspecified, uncertain, and approximate dates

EDTF.js keeps track of qualified dates using bitmasks. If you are interested
in binary yes or no, you can always convert a bitmask's value to boolean. For
more fine-grained information, the `Bitmask` class provides a convenient
interface for accessing these states:

     edtf('2016-05?').uncertain.value        #-> 63 / yes
     edtf('2016-05?').approximate.value      #-> 0  / no

     edtf('2016-05?').uncertain.is('year')   #-> 15 / yes
     edtf('2016-05?').uncertain.is('month')  #-> 48 / yes
     edtf('2016-05?').uncertain.is('day')    #-> 0  / no

     edtf('2016-?05').uncertain.is('year')   #-> 0  / no
     edtf('2016-?05').uncertain.is('month')  #-> 48 / yes

     edtf('201X-XX').unspecified.value       #-> 56 / yes
     edtf('201X-XX').unspecified.is('year')  #-> 8  / yes
     edtf('201X-XX').unspecified.is('month') #-> 48 / yes
     edtf('201X-XX').unspecified.is('day')   #-> 0  / no

Instead of `year`, `month`, and `day`, you can also query a string-based
representation of the bitmask:

     edtf('201X-XX').unspecified.test('XXYYMMDD') #-> 0  / no
     edtf('201X-XX').unspecified.test('YYYXMMDD') #-> 8  / yes

When printing qualified dates, EDTF.js will try to find an optimal
rendtition of qualification symbols. For that reason, you can use EDTF.js
to normalize EDTF strings:

     edtf('?2016-?05-31').edtf   #-> 2016-05?-31
     edtf('?2016-?05~-31').edtf  #-> 2016-05%-31

Because every extended date object has a `min` and `max` value, you can
always test if one date covers another one:

     edtf('2016-06/2016-09').covers(edtf('2016-08-24')) #-> true
     edtf('2016-06/2016-09').covers(edtf('2016-05-31')) #-> false

Iterable dates offer an `includes()` test as well which returns true
only if a given date is part of the iteration. For example:

     edtf('2016-06/2016-09').includes(edtf('2016-08-24')) #-> false

August 24, 2016 is covered by the interval '2016-06/2016-09' but is not
included in it, because the interval has month precision and can be
iterated as:

     [...edtf('2016-06/2016-09')]
     #-> [2016-06, 2016-07, 2016-08, 2016-09]


### Enumerating dates

EDTF.js dates offer iterators to help measure the duration between
two dates. These iterators are dependent on a date's precision:

     edtf('2016').next()        #-> 2017
     edtf('2016-05').next()     #-> 2016-06
     edtf('2016-02-28').next()  #-> 2016-02-29
     edtf('2017-02-28').next()  #-> 2017-03-01

Careful, if your date has no precision, next will return the next
second!

The generator `*between()` returns all the dates, by precision,
between two dates; similarly, `*until()` returns all dates in between
and includes the first of the two dates; to generate the full range
inluding both dates, use `*through()`.

     [...edtf('2016-05').between(edtf('2016-07'))]
     #-> [2016-06]

     [...edtf('2016-05').until(edtf('2016-07'))]
     #-> [2016-05, 2016-06]

     [...edtf('2016-05').through(edtf('2016-07'))]
     #-> [2016-05, 2016-06, 2016-07]

Note, that all range generators also work in reverse order:

     [...edtf('2016-07').through(edtf('2016-05'))]
     #-> [2016-07, 2016-06, 2016-05]

     [...edtf('2016-07').until(edtf('2016-05'))]
     #-> [2016-07, 2016-06]

     [...edtf('2016-07').between(edtf('2016-05'))]
     #-> [2016-06]

### Iterators

The EDTF.js classes `Date`, `Interval`, `List`, and `Set` (lists model
EDTF's 'multiple dates', while sets model 'one of a set') are iterable.
Dates are iterable.

     [...edtf('2015/2018')]
     #-> [2015, 2016, 2017, 2018]

Note that this also works with varying precisions:

     [...edtf('2015-10/2016')]
      #-> [2015-10, 2015-11, 2015-12, 2016-01, 2016-02, 2016]

Consecutive dates in lists and sets are expanded during an iteration:

     [...edtf('{2015,2018..2020}')]
     #-> [2015, 2018, 2019, 2020]


### Parser

To use EDTF.js' date parser directly, call `parse()` with an input
string and optional parser constraints. The parser will always return
plain JavaScript objects which you can pass to `edtf()` for conversion
to extended date object, or to your own post-processing.

    import { parse } from 'edtf'
    parse('2016-02')
    #-> { type: 'Date', level: 0, values: [2016, 1] }

As you can see, the parser output includes the compatibility level of
the date parsed; the values array contains the individual date parts
in a format compatible with JavaScript's Date semantics (months are
a zero-based index).

Unspecified, uncertain, or approximate dates are returned as a numeric
value representing a bitmask; refer to the `Bitmask` class for details.

    parse('2016?-~02')
    #-> { type: 'Date', level: 2, values: [2016, 1], uncertain: 15, approximate: 48 }

    parse('20XX-02')
    #-> { type: 'Date', level: 2, values: [2000, 1], unspecified: 12 }

Note that unspecified date values will always return the least possible value,
e.g., '2000' for '20XX'. Note, also, that EDTF.js will not parse impossible
unspecified dates. For instance, none of the following examples can be
valid dates:

    parse('2016-02-3X') #-> A day in February cannot start with a 3
    parse('2016-2X-XX') #-> There are only 12 months
    parse('2016-XX-32') #-> No month has 32 days

Intervals, Sets, and Lists will contain their parsed constituent dates in
the values array:

    parse('2015/2016')
    #-> { type: 'Interval', level: 0, values: [{..}, {..}] }

#### Tuning parser compliance

By passing `level` or `types` constraints to the parser, you can ensure
EDTF.js will accept only dates supported by your application.

    parse('2016?', { level: 0 }) #-> parse error
    parse('2016?', { level: 1 }) #-> ok

    parse('2016?-02', { level: 1 }) #-> parse error
    parse('2016?-02', { level: 2 }) #-> ok

    parse('2016-21', { types: ['Date'] })           #-> parse error
    parse('2016-21', { types: ['Date', 'Season'] }) #-> ok

    parse('2016?', { level: 0, types: ['Date'] })   #-> parse error
    parse('2016?', { level: 1, types: ['Date'] })   #-> ok


Specific features can be enabled,
regardless of `level` or `types` constraints.

    parse('2016-21/2016-22', { level: 1 })          #-> parse error
    parse('2016-21/2016-22', {
      level: 1,
      seasonIntervals: true
    })                                              #-> ok

You can review or change the parser's default constraints
via the `defaults` object.

    import { defaults } from 'edtf'
    defaults.level = 1

### Generator

EDTF.js can generate random EDTF strings for you. Simply add
`randexp` to your NPM dependencies and import `edtf/sample`
to create a new iterator:

    import { sample } from 'edtf/sample'
    let it = sample()

    it.next() #-> { value: '0097-26', done: false }
    it.next() #-> { value: '0000-09-30T22:50:54-07', done: false }
    ...

For a finite iterator, simply pass a count:

    [...sample({ count: 3 })]
    #-> ['-003%', '-0070-07-31%', '[-0080-10..]']

You can also generate strings at a given compatibility level:

    [...sample({ count: 3, level: 0 })]
    #-> ['0305/0070-04-30', '-07', '0000/0013']

    [...sample({ count: 3, level: 1 })]
    #-> ['00XX', 'Y80105', '0000~']

    [...sample({ count: 3, level: 2 })]
    #-> ['Y1E30', '-8110S2', '{%0401}']

Note that some grammar rules at levels 1 and 2 may, potentially,
generate strings at a lower level (but never higher).

Finally, at each level you can also limit the generated strings
to a given type (you must specify a level for this to work):

    [...sample({ count: 3, level: 2, type: 'Decade' })]
    #-> ['003', '030~', '000']


## Credits
The EDTF.js parser is based on the awesome
[nearley](https://github.com/Hardmath123/nearley) parser generator.

The EDTF.js sample generator uses the ingenious
[randexp](https://github.com/fent/randexp.js).

## License
EDTF.js is licensed under the terms of the BSD-2-Clause license.
