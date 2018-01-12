# EDTF.js

[![Build Status](https://travis-ci.org/inukshuk/edtf.js.svg?branch=master)](https://travis-ci.org/inukshuk/edtf.js)
[![Coverage Status](https://coveralls.io/repos/github/inukshuk/edtf.js/badge.svg?branch=master)](https://coveralls.io/github/inukshuk/edtf.js?branch=master)
[![NPM version](https://img.shields.io/npm/v/edtf.svg)](https://www.npmjs.com/packages/edtf)
[![License AGPL-3.0](https://img.shields.io/npm/l/edtf.svg)](https://opensource.org/licenses/AGPL-3.0)

An Extended Date Time Format (EDTF) / ISO 8601-2 parser and toolkit for
date/time hackers and enthusiasts.

## Compatibility

### EDTF / ISO 8601-2
EDTF.js fully implements [EDTF](http://www.loc.gov/standards/datetime)
levels 0, 1, and 2 as specified by WD 2016-02-16 of ISO 8601-2 with
the following exceptions (as raised by the EDTF community):

1. Symbols for unknown and open dates in intervals have been switched:
   `*` makes more sense to represent an open date because it is often
   used as a wildcard to match "all" or "everything". Also, when an
   interval is blank, it suggessts "incomplete" or "unknown".

2. "Before or after" is redundant and has been removed. It is covered
   by "One of a Set", e.g., `[1760-12..]` which means "December 1760
   or some later month."

3. Seasons in intervals are supported at the experimental/non-standard
   level 3.

### ES6
EDTF.js is written as a standard Nodes.js / CommonJS module using many ES6
features. It therefore requires Node.js 6 or later (for Nodes.js 4/5 use the
appropriate `--harmony` flags as necessary).

### Bundling using RollUp
To bundle EDTF.js with RollUp you'll need to enable the following plugins

* rollup-plugin-json
* rollup-plugin-node-resolve
* rollup-plugin-commonjs
* rollup-plugin-node-globals (optional)
* rollup-plugin-node-builtins (optional)

The last two are optional; you need them only if you want to include Node.js
`assert` in your bundle.

## Installation
    $ npm install edtf


## Manual

EDTF.js exports a top-level function which takes either a string
(with optional parser constraints), a parse result, a regular or any
of the extended date objects and returns a new, extended date object
as appropriate.

    const edtf = require('edtf')

    edtf('2016-XX')          #-> returns an edtf.Date
    edtf(new Date())         #-> returns an edtf.Date
    edtf('2016-04~/2016-05') #-> returns an edtf.Interval

For a list of all types supported by EDTF.js see:

    edtf.types
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
more fine-grained information, the `edtf.Bitmask` class provides a convenient
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

     [...edtf('2016-05').between('2016-07')]
     #-> [2016-06]

     [...edtf('2016-05').until('2016-07')]
     #-> [2016-05, 2016-06]

     [...edtf('2016-05').through('2016-07')]
     #-> [2016-05, 2016-06, 2016-07]

Note, that all range generators also work in reverse order:

     [...edtf('2016-07').through('2016-05')]
     #-> [2016-07, 2016-06, 2016-05]

     [...edtf('2016-07').until('2016-05')]
     #-> [2016-07, 2016-06]

     [...edtf('2016-07').between('2016-05')]
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

To use EDTF.js' date parser directly, call `edtf.parse()` with an input
string and optional parser constraints. The parser will always return
plain JavaScript objects which you can pass to `edtf()` for conversion
to extended date object, or to your own post-processing.

    edtf.parse('2016-02')
    #-> { type: 'Date', level: 0, values: [2016, 1] }

As you can see, the parser output includes the compatibility level of
the date parsed; the values array contains the individual date parts
in a format compatible with JavaScript's Date semantics (months are
a zero-based index).

Unspecified, uncertain, or approximate dates are returned as a numeric
value representing a bitmask; refer to the `edtf.Bitmask` class for details.

    edtf.parse('2016?-~02')
    #-> { type: 'Date', level: 2, values: [2016, 1], uncertain: 15, approximate: 48 }

    edtf.parse('20XX-02')
    #-> { type: 'Date', level: 2, values: [2000, 1], unspecified: 12 }

Note that unspecified date values will always return the least possible value,
e.g., '2000' for '20XX'. Note, also, that EDTF.js will not parse impossible
unspecified dates. For instance, none of the following examples can be
valid dates:

    edtf.parse('2016-02-3X') #-> A day in February cannot start with a 3
    edtf.parse('2016-2X-XX') #-> There are only 12 months
    edtf.parse('2016-XX-32') #-> No month has 32 days

Intervals, Sets, and Lists will contain their parsed constituent dates in
the values array:

    edtf.parse('2015/2016')
    #-> { type: 'Interval', level: 0, values: [{..}, {..}] }

By passing `level` or `types` constraints to the parser, you can ensure
EDTF.js will accept only dates supported by your application.

    edtf.parse('2016?', { level: 0 }) #-> parse error
    edtf.parse('2016?', { level: 1 }) #-> ok

    edtf.parse('2016?-02', { level: 1 }) #-> parse error
    edtf.parse('2016?-02', { level: 2 }) #-> ok

    edtf.parse('2016-21', { types: ['Date'] })           #-> parse error
    edtf.parse('2016-21', { types: ['Date', 'Season'] }) #-> ok


    edtf.parse('2016?', { level: 0, types: ['Date'] })   #-> parse error
    edtf.parse('2016?', { level: 1, types: ['Date'] })   #-> ok


### Generator

EDTF.js can generate random EDTF strings for you. Simply call
`edtf.sample()` to create a new iterator:

    let it = edtf.sample()

    it.next() #-> { value: '0097-26', done: false }
    it.next() #-> { value: '0000-09-30T22:50:54-07', done: false }
    ...

For a finite iterator, simply pass a count:

    [...edtf.sample({ count: 3 }]
    #-> ['-003%', '-0070-07-31%', '[-0080-10..]']

You can also generate strings at a given compatibility level:

    [...edtf.sample({ count: 3, level: 0 }]
    #-> ['0305/0070-04-30', '-07', '0000/0013']

    [...edtf.sample({ count: 3, level: 1 }]
    #-> ['00XX', 'Y80105', '0000~']

    [...edtf.sample({ count: 3, level: 2 }]
    #-> ['Y1E30', '-8110S2', '{%0401}']

Note that some grammar rules at levels 1 and 2 may, potentially,
generate strings at a lower level (but never higher).

Finally, at each level you can also limit the generated strings
to a given type (you must specify a level for this to work):

    [...edtf.sample({ count: 3, level: 2, type: 'Decade' }]
    #-> ['003', '030~', '000']


## Credits
The EDTF.js parser is based on the awesome
[nearley](https://github.com/Hardmath123/nearley) parser generator.

The EDTF.js generator uses the ingenious
[randexp](https://github.com/fent/randexp.js).

## License
AGPL-3.0
