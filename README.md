# EDTF.js

[![Build Status](https://travis-ci.org/inukshuk/edtf.js.svg?branch=master)](https://travis-ci.org/inukshuk/edtf.js)
[![Coverage Status](https://coveralls.io/repos/github/inukshuk/edtf.js/badge.svg?branch=master)](https://coveralls.io/github/inukshuk/edtf.js?branch=master)
[![NPM version](https://img.shields.io/npm/v/edtf.svg)](https://www.npmjs.com/packages/edtf)
[![License AGPL-3.0](https://img.shields.io/npm/l/edtf.svg)](https://opensource.org/licenses/AGPL-3.0)

An Extended Date Time Format (EDTF) / ISO 8601-2 parser and toolkit for
date/time hackers and enthusiasts.

## Compatibility

### EDFT / ISO 8601-2
EDTF.js fully implements [EDTF](http://www.loc.gov/standards/datetime)
levels 0, 1, and 2 as specified by WD 2016-02-16 of ISO 8601-2 with
the following exceptions (as raised by the EDTF community):

1. Symbols for unknown and open dates in intervals have been switched:
   `*` makes more sense to represent an open date because it is often
   used as a wildcard to match "all" or "everything". Also, when an
   interval is blank, it suggessts "incomplete" or "unknown".

2. "Before or after" is redundant and has been removed. It is covered
   by "One of a Set", e.g., `[1760-12..]` which means "December 1760
   or some later month".

### ES6
EDTF.js is written in ES6 and therefore requires Node.js 6+ or a modern
browser. For Node.js 4/5 use the appropriate `--harmony` flags as necessary.


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
corresponding EDTF string, its minimal and maximal numeric value,
its type, as well as its date part values.

    edtf('2016?').edtf         #-> '2016?'

    edtf('2016-02').min        #-> 1454284800000, i.e. 2016-02-01T00:00:00Z
    edtf('2016-02').max        #-> 1456790399999, i.e. 2016-02-29T23:59:59Z

    edtf('2016-02-2X').min     #-> 1455926400000, i.e. 2016-02-20T00:00:00Z
    edtf('2016-02-2X').max     #-> 1456790399999, i.e. 2016-02-29T23:59:59Z

    edtf('[..2016,2017]').min  #-> -Infinity
    edtf('[..2016,2017]').max  #-> 1514764799999, i.e. 2017-12-31T23:59:59Z

    edtf('2016?-02').values    #-> [2016, 1]
    edtf('2016-05').values     #-> [2016, 4]

See below, for more advanced features of each individual extended
date type.

### Parser

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
generate strings at a lower level (but not higher).

Finally, at each level you can also limit the generated strings
to a given type (you must specify a level for this to work):

    [...edtf.sample({ count: 3, level: 2, type: 'Decade' }]
    #-> ['003', '030~', '000']


## API

## Credits
The EDTF.js parser is based on the awesome
[nearley](https://github.com/Hardmath123/nearley) parser generator.

The EDTF.js generator uses the ingenious
[randexp](https://github.com/fent/randexp.js).

## License
AGPL-3.0
