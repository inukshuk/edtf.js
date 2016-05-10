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
levels 0, 1, and 2 as specified by WD 2016-02-16 of ISO 8601-2.

## Installation

### Node.js

    $ npm install edtf

EDTF.js is written in ES6 and therefore requires Node.js 6+. You should
be able to use it in Node 4 or 5 when setting the appropriate
`--harmony` flags or by using your favourite transpiler.

### Browser
EDTF.js was written for Node.js. While we don't currently provide a
browser package, it should be easily possible to create one using
browserify or similar tools.

## Parser

## Generator

## API

## Credits
The EDTF.js parser is based on the awesome
[nearley](https://github.com/Hardmath123/nearley) parser generator.

The EDTF.js generator uses the ingenious
[randexp](https://github.com/fent/randexp.js).

## License

AGPL-3.0
