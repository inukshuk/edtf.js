'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var assert = require('assert');
var nearley = require('nearley');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var assert__default = /*#__PURE__*/_interopDefaultLegacy(assert);
var nearley__default = /*#__PURE__*/_interopDefaultLegacy(nearley);

const DAY = /^days?$/i;
const MONTH = /^months?$/i;
const YEAR = /^years?$/i;
const SYMBOL = /^[xX]$/;
const SYMBOLS = /[xX]/g;
const PATTERN = /^[0-9xXdDmMyY]{8}$/;
const YYYYMMDD = 'YYYYMMDD'.split('');
const MAXDAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const { floor: floor$2, pow, max, min } = Math;


/**
 * Bitmasks are used to set Unspecified, Uncertain and
 * Approximate flags for a Date. The bitmask for one
 * feature corresponds to a numeric value based on the
 * following pattern:
 *
 *           YYYYMMDD
 *           --------
 *   Day     00000011
 *   Month   00001100
 *   Year    11110000
 *
 */
class Bitmask {

  static test(a, b) {
    return this.convert(a) & this.convert(b)
  }

  static convert(value = 0) { // eslint-disable-line complexity
    value = value || 0;

    if (value instanceof Bitmask) return value.value

    switch (typeof value) {
    case 'number': return value

    case 'boolean': return value ? Bitmask.YMD : 0

    case 'string':
      if (DAY.test(value)) return Bitmask.DAY
      if (MONTH.test(value)) return Bitmask.MONTH
      if (YEAR.test(value)) return Bitmask.YEAR
      if (PATTERN.test(value)) return Bitmask.compute(value)
      // fall through!

    default:
      throw new Error(`invalid value: ${value}`)
    }
  }

  static compute(value) {
    return value.split('').reduce((memo, c, idx) =>
      (memo | (SYMBOL.test(c) ? pow(2, idx) : 0)), 0)
  }

  static values(mask, digit = 0) {
    let num = Bitmask.numbers(mask, digit).split('');
    let values = [Number(num.slice(0, 4).join(''))];

    if (num.length > 4) values.push(Number(num.slice(4, 6).join('')));
    if (num.length > 6) values.push(Number(num.slice(6, 8).join('')));

    return Bitmask.normalize(values)
  }

  static numbers(mask, digit = 0) {
    return mask.replace(SYMBOLS, digit)
  }

  static normalize(values) {
    if (values.length > 1)
      values[1] = min(11, max(0, values[1] - 1));

    if (values.length > 2)
      values[2] = min(MAXDAYS[values[1]] || NaN, max(1, values[2]));

    return values
  }


  constructor(value = 0) {
    this.value = Bitmask.convert(value);
  }

  test(value = 0) {
    return this.value & Bitmask.convert(value)
  }

  bit(k) {
    return this.value & pow(2, k)
  }

  get day() { return this.test(Bitmask.DAY) }

  get month() { return this.test(Bitmask.MONTH) }

  get year() { return this.test(Bitmask.YEAR) }


  add(value) {
    return (this.value = this.value | Bitmask.convert(value)), this
  }

  set(value = 0) {
    return (this.value = Bitmask.convert(value)), this
  }

  mask(input = YYYYMMDD, offset = 0, symbol = 'X') {
    return input.map((c, idx) => this.bit(offset + idx) ? symbol : c)
  }

  masks(values, symbol = 'X') {
    let offset = 0;

    return values.map(value => {
      let mask = this.mask(value.split(''), offset, symbol);
      offset = offset + mask.length;

      return mask.join('')
    })
  }

  // eslint-disable-next-line complexity
  max([year, month, day]) {
    if (!year) return []

    year = Number(
      (this.test(Bitmask.YEAR)) ? this.masks([year], '9')[0] : year
    );

    if (!month) return [year]

    month = Number(month) - 1;

    switch (this.test(Bitmask.MONTH)) {
    case Bitmask.MONTH:
      month = 11;
      break
    case Bitmask.MX:
      month = (month < 9) ? 8 : 11;
      break
    case Bitmask.XM:
      month = (month + 1) % 10;
      month = (month < 3) ? month + 9 : month - 1;
      break
    }

    if (!day) return [year, month]

    day = Number(day);

    switch (this.test(Bitmask.DAY)) {
    case Bitmask.DAY:
      day = MAXDAYS[month];
      break
    case Bitmask.DX:
      day = min(MAXDAYS[month], day + (9 - (day % 10)));
      break
    case Bitmask.XD:
      day = day % 10;

      if (month === 1) {
        day = (day === 9 && !leap(year)) ? day + 10 : day + 20;

      } else {
        day = (day < 2) ? day + 30 : day + 20;
        if (day > MAXDAYS[month]) day = day - 10;
      }

      break
    }

    if (month === 1 && day > 28 && !leap(year)) {
      day = 28;
    }

    return [year, month, day]
  }

  // eslint-disable-next-line complexity
  min([year, month, day]) {
    if (!year) return []

    year = Number(
      (this.test(Bitmask.YEAR)) ? this.masks([year], '0')[0] : year
    );

    if (month == null) return [year]

    month = Number(month) - 1;

    switch (this.test(Bitmask.MONTH)) {
    case Bitmask.MONTH:
    case Bitmask.XM:
      month = 0;
      break
    case Bitmask.MX:
      month = (month < 9) ? 0 : 9;
      break
    }

    if (!day) return [year, month]

    day = Number(day);

    switch (this.test(Bitmask.DAY)) {
    case Bitmask.DAY:
      day = 1;
      break
    case Bitmask.DX:
      day = max(1, floor$2(day / 10) * 10);
      break
    case Bitmask.XD:
      day = max(1, day % 10);
      break
    }

    return [year, month, day]
  }

  marks(values, symbol = '?') {
    return values
      .map((value, idx) => [
        this.qualified(idx * 2) ? symbol : '',
        value,
        this.qualified(idx * 2 + 1) ? symbol : ''
      ].join(''))
  }

  qualified(idx) { // eslint-disable-line complexity
    switch (idx) {
    case 1:
      return this.value === Bitmask.YEAR ||
        (this.value & Bitmask.YEAR) && !(this.value & Bitmask.MONTH)
    case 2:
      return this.value === Bitmask.MONTH ||
        (this.value & Bitmask.MONTH) && !(this.value & Bitmask.YEAR)
    case 3:
      return this.value === Bitmask.YM
    case 4:
      return this.value === Bitmask.DAY ||
        (this.value & Bitmask.DAY) && (this.value !== Bitmask.YMD)
    case 5:
      return this.value === Bitmask.YMD
    default:
      return false
    }
  }

  qualify(idx) {
    return (this.value = this.value | Bitmask.UA[idx]), this
  }

  toJSON() {
    return this.value
  }

  toString(symbol = 'X') {
    return this.masks(['YYYY', 'MM', 'DD'], symbol).join('-')
  }
}

Bitmask.prototype.is = Bitmask.prototype.test;

function leap(year) {
  if (year % 4 > 0) return false
  if (year % 100 > 0) return true
  if (year % 400 > 0) return false
  return true
}

Bitmask.DAY   = Bitmask.D = Bitmask.compute('yyyymmxx');
Bitmask.MONTH = Bitmask.M = Bitmask.compute('yyyyxxdd');
Bitmask.YEAR  = Bitmask.Y = Bitmask.compute('xxxxmmdd');

Bitmask.MD  = Bitmask.M | Bitmask.D;
Bitmask.YMD = Bitmask.Y | Bitmask.MD;
Bitmask.YM  = Bitmask.Y | Bitmask.M;

Bitmask.YYXX = Bitmask.compute('yyxxmmdd');
Bitmask.YYYX = Bitmask.compute('yyyxmmdd');
Bitmask.XXXX = Bitmask.compute('xxxxmmdd');

Bitmask.DX = Bitmask.compute('yyyymmdx');
Bitmask.XD = Bitmask.compute('yyyymmxd');
Bitmask.MX = Bitmask.compute('yyyymxdd');
Bitmask.XM = Bitmask.compute('yyyyxmdd');

/*
 * Map each UA symbol position to a mask.
 *
 *   ~YYYY~-~MM~-~DD~
 *   0    1 2  3 4  5
 */
Bitmask.UA = [
  Bitmask.YEAR,
  Bitmask.YEAR,   // YEAR !DAY
  Bitmask.MONTH,
  Bitmask.YM,
  Bitmask.DAY,    // YEARDAY
  Bitmask.YMD
];

const { assign: assign$1 } = Object;


function num(data) {
  return Number(Array.isArray(data) ? data.join('') : data)
}

function join(data) {
  return data.join('')
}

function zero() { return 0 }

function nothing() { return null }

function pick(...args) {
  return args.length === 1 ?
    data => data[args[0]] :
    data => concat(data, args)
}

function pluck(...args) {
  return data => args.map(i => data[i])
}

function concat(data, idx = data.keys()) {
  return Array.from(idx)
    .reduce((memo, i) => data[i] !== null ? memo.concat(data[i]) : memo, [])
}

function merge(...args) {
  if (typeof args[args.length - 1] === 'object')
    var extra = args.pop();

  return data => assign$1(args.reduce((a, i) => assign$1(a, data[i]), {}), extra)
}

function interval(level) {
  return data => ({
    values: [data[0], data[2]],
    type: 'Interval',
    level
  })
}

function masked(type = 'unspecified', symbol = 'X') {
  return (data, _, reject) => {
    data = data.join('');

    let negative = data.startsWith('-');
    let mask = data.replace(/-/g, '');

    if (mask.indexOf(symbol) === -1) return reject

    let values = Bitmask.values(mask, 0);

    if (negative) values[0] = -values[0];

    return {
      values, [type]: Bitmask.compute(mask)
    }
  }
}

function date$6(values, level = 0, extra = null) {
  return assign$1({
    type: 'Date',
    level,
    values: Bitmask.normalize(values.map(Number))
  }, extra)
}

function year(values, level = 1, extra = null) {
  return assign$1({
    type: 'Year',
    level,
    values: values.map(Number)
  }, extra)
}

function century(value, level = 0) {
  return {
    type: 'Century',
    level,
    values: [value]
  }
}

function decade(value, level = 2) {
  return {
    type: 'Decade',
    level,
    values: [value]
  }
}

function datetime(data) {
  let offset = data[3];
  if (offset == null) offset = new Date().getTimezoneOffset();

  return {
    values: Bitmask.normalize(data[0].map(Number)).concat(data[2]),
    offset,
    type: 'Date',
    level: 0
  }
}

function season(data, level = 1) {
  return {
    type: 'Season',
    level,
    values: [Number(data[0]), Number(data[2])]
  }
}

function list(data) {
  return assign$1({ values: data[1], level: 2 }, data[0], data[2])
}

function qualify([parts], _, reject) {
  let q = {
    uncertain: new Bitmask(), approximate: new Bitmask()
  };

  let values = parts
    .map(([lhs, part, rhs], idx) => {
      for (let ua in lhs) q[ua].qualify(idx * 2);
      for (let ua in rhs) q[ua].qualify(1 + idx * 2);
      return part
    });

  return (!q.uncertain.value && !q.approximate.value) ?
    reject : {
      ...date$6(values, 2),
      uncertain: q.uncertain.value,
      approximate: q.approximate.value
    }
}

// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
function id(x) { return x[0]; }
let Lexer = undefined;
let ParserRules = [
    {"name": "edtf", "symbols": ["L0"], "postprocess": id},
    {"name": "edtf", "symbols": ["L1"], "postprocess": id},
    {"name": "edtf", "symbols": ["L2"], "postprocess": id},
    {"name": "edtf", "symbols": ["L3"], "postprocess": id},
    {"name": "L0", "symbols": ["date_time"], "postprocess": id},
    {"name": "L0", "symbols": ["century"], "postprocess": id},
    {"name": "L0", "symbols": ["L0i"], "postprocess": id},
    {"name": "L0i", "symbols": ["date_time", {"literal":"/"}, "date_time"], "postprocess": interval(0)},
    {"name": "century", "symbols": ["positive_century"], "postprocess": data => century(data[0])},
    {"name": "century$string$1", "symbols": [{"literal":"0"}, {"literal":"0"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "century", "symbols": ["century$string$1"], "postprocess": data => century(0)},
    {"name": "century", "symbols": [{"literal":"-"}, "positive_century"], "postprocess": data => century(-data[1])},
    {"name": "positive_century", "symbols": ["positive_digit", "digit"], "postprocess": num},
    {"name": "positive_century", "symbols": [{"literal":"0"}, "positive_digit"], "postprocess": num},
    {"name": "date_time", "symbols": ["date"], "postprocess": id},
    {"name": "date_time", "symbols": ["datetime"], "postprocess": id},
    {"name": "date", "symbols": ["year"], "postprocess": data => date$6(data)},
    {"name": "date", "symbols": ["year_month"], "postprocess": data => date$6(data[0])},
    {"name": "date", "symbols": ["year_month_day"], "postprocess": data => date$6(data[0])},
    {"name": "year", "symbols": ["positive_year"], "postprocess": id},
    {"name": "year", "symbols": ["negative_year"], "postprocess": id},
    {"name": "year$string$1", "symbols": [{"literal":"0"}, {"literal":"0"}, {"literal":"0"}, {"literal":"0"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "year", "symbols": ["year$string$1"], "postprocess": join},
    {"name": "positive_year", "symbols": ["positive_digit", "digit", "digit", "digit"], "postprocess": join},
    {"name": "positive_year", "symbols": [{"literal":"0"}, "positive_digit", "digit", "digit"], "postprocess": join},
    {"name": "positive_year$string$1", "symbols": [{"literal":"0"}, {"literal":"0"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "positive_year", "symbols": ["positive_year$string$1", "positive_digit", "digit"], "postprocess": join},
    {"name": "positive_year$string$2", "symbols": [{"literal":"0"}, {"literal":"0"}, {"literal":"0"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "positive_year", "symbols": ["positive_year$string$2", "positive_digit"], "postprocess": join},
    {"name": "negative_year", "symbols": [{"literal":"-"}, "positive_year"], "postprocess": join},
    {"name": "year_month", "symbols": ["year", {"literal":"-"}, "month"], "postprocess": pick(0, 2)},
    {"name": "year_month_day", "symbols": ["year", {"literal":"-"}, "month_day"], "postprocess": pick(0, 2)},
    {"name": "month", "symbols": ["d01_12"], "postprocess": id},
    {"name": "month_day", "symbols": ["m31", {"literal":"-"}, "day"], "postprocess": pick(0, 2)},
    {"name": "month_day", "symbols": ["m30", {"literal":"-"}, "d01_30"], "postprocess": pick(0, 2)},
    {"name": "month_day$string$1", "symbols": [{"literal":"0"}, {"literal":"2"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "month_day", "symbols": ["month_day$string$1", {"literal":"-"}, "d01_29"], "postprocess": pick(0, 2)},
    {"name": "day", "symbols": ["d01_31"], "postprocess": id},
    {"name": "datetime$ebnf$1$subexpression$1", "symbols": ["timezone"], "postprocess": id},
    {"name": "datetime$ebnf$1", "symbols": ["datetime$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "datetime$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "datetime", "symbols": ["year_month_day", {"literal":"T"}, "time", "datetime$ebnf$1"], "postprocess": datetime},
    {"name": "time", "symbols": ["hours", {"literal":":"}, "minutes", {"literal":":"}, "seconds", "milliseconds"], "postprocess": pick(0, 2, 4, 5)},
    {"name": "time", "symbols": ["hours", {"literal":":"}, "minutes"], "postprocess": pick(0, 2)},
    {"name": "time$string$1", "symbols": [{"literal":"2"}, {"literal":"4"}, {"literal":":"}, {"literal":"0"}, {"literal":"0"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "time$ebnf$1$string$1", "symbols": [{"literal":":"}, {"literal":"0"}, {"literal":"0"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "time$ebnf$1", "symbols": ["time$ebnf$1$string$1"], "postprocess": id},
    {"name": "time$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "time", "symbols": ["time$string$1", "time$ebnf$1"], "postprocess": () => [24, 0, 0]},
    {"name": "hours", "symbols": ["d00_23"], "postprocess": num},
    {"name": "minutes", "symbols": ["d00_59"], "postprocess": num},
    {"name": "seconds", "symbols": ["d00_59"], "postprocess": num},
    {"name": "milliseconds", "symbols": []},
    {"name": "milliseconds", "symbols": [{"literal":"."}, "d3"], "postprocess": data => num(data.slice(1))},
    {"name": "timezone", "symbols": [{"literal":"Z"}], "postprocess": zero},
    {"name": "timezone$subexpression$1", "symbols": [{"literal":"-"}]},
    {"name": "timezone$subexpression$1", "symbols": [{"literal":"−"}]},
    {"name": "timezone", "symbols": ["timezone$subexpression$1", "offset"], "postprocess": data => -data[1]},
    {"name": "timezone", "symbols": [{"literal":"+"}, "positive_offset"], "postprocess": pick(1)},
    {"name": "positive_offset", "symbols": ["offset"], "postprocess": id},
    {"name": "positive_offset$string$1", "symbols": [{"literal":"0"}, {"literal":"0"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "positive_offset$ebnf$1", "symbols": [{"literal":":"}], "postprocess": id},
    {"name": "positive_offset$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "positive_offset$string$2", "symbols": [{"literal":"0"}, {"literal":"0"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "positive_offset", "symbols": ["positive_offset$string$1", "positive_offset$ebnf$1", "positive_offset$string$2"], "postprocess": zero},
    {"name": "positive_offset$subexpression$1$string$1", "symbols": [{"literal":"1"}, {"literal":"2"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "positive_offset$subexpression$1", "symbols": ["positive_offset$subexpression$1$string$1"]},
    {"name": "positive_offset$subexpression$1$string$2", "symbols": [{"literal":"1"}, {"literal":"3"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "positive_offset$subexpression$1", "symbols": ["positive_offset$subexpression$1$string$2"]},
    {"name": "positive_offset$ebnf$2", "symbols": [{"literal":":"}], "postprocess": id},
    {"name": "positive_offset$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "positive_offset", "symbols": ["positive_offset$subexpression$1", "positive_offset$ebnf$2", "minutes"], "postprocess": data => num(data[0]) * 60 + data[2]},
    {"name": "positive_offset$string$3", "symbols": [{"literal":"1"}, {"literal":"4"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "positive_offset$ebnf$3", "symbols": [{"literal":":"}], "postprocess": id},
    {"name": "positive_offset$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "positive_offset$string$4", "symbols": [{"literal":"0"}, {"literal":"0"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "positive_offset", "symbols": ["positive_offset$string$3", "positive_offset$ebnf$3", "positive_offset$string$4"], "postprocess": () => 840},
    {"name": "positive_offset", "symbols": ["d00_14"], "postprocess": data => num(data[0]) * 60},
    {"name": "offset$ebnf$1", "symbols": [{"literal":":"}], "postprocess": id},
    {"name": "offset$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "offset", "symbols": ["d01_11", "offset$ebnf$1", "minutes"], "postprocess": data => num(data[0]) * 60 + data[2]},
    {"name": "offset$string$1", "symbols": [{"literal":"0"}, {"literal":"0"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "offset$ebnf$2", "symbols": [{"literal":":"}], "postprocess": id},
    {"name": "offset$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "offset", "symbols": ["offset$string$1", "offset$ebnf$2", "d01_59"], "postprocess": data => num(data[2])},
    {"name": "offset$string$2", "symbols": [{"literal":"1"}, {"literal":"2"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "offset$ebnf$3", "symbols": [{"literal":":"}], "postprocess": id},
    {"name": "offset$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "offset$string$3", "symbols": [{"literal":"0"}, {"literal":"0"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "offset", "symbols": ["offset$string$2", "offset$ebnf$3", "offset$string$3"], "postprocess": () => 720},
    {"name": "offset", "symbols": ["d01_12"], "postprocess": data => num(data[0]) * 60},
    {"name": "L1", "symbols": ["L1d"], "postprocess": id},
    {"name": "L1", "symbols": ["L1Y"], "postprocess": id},
    {"name": "L1", "symbols": ["L1S"], "postprocess": id},
    {"name": "L1", "symbols": ["L1i"], "postprocess": id},
    {"name": "L1d", "symbols": ["date_ua"], "postprocess": id},
    {"name": "L1d", "symbols": ["L1X"], "postprocess": merge(0, { type: 'Date', level: 1 })},
    {"name": "date_ua", "symbols": ["date", "UA"], "postprocess": merge(0, 1, { level: 1 })},
    {"name": "L1i", "symbols": ["L1i_date", {"literal":"/"}, "L1i_date"], "postprocess": interval(1)},
    {"name": "L1i", "symbols": ["date_time", {"literal":"/"}, "L1i_date"], "postprocess": interval(1)},
    {"name": "L1i", "symbols": ["L1i_date", {"literal":"/"}, "date_time"], "postprocess": interval(1)},
    {"name": "L1i_date", "symbols": [], "postprocess": nothing},
    {"name": "L1i_date", "symbols": ["date_ua"], "postprocess": id},
    {"name": "L1i_date", "symbols": ["INFINITY"], "postprocess": id},
    {"name": "INFINITY$string$1", "symbols": [{"literal":"."}, {"literal":"."}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "INFINITY", "symbols": ["INFINITY$string$1"], "postprocess": () => Infinity},
    {"name": "L1X$string$1", "symbols": [{"literal":"-"}, {"literal":"X"}, {"literal":"X"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "L1X", "symbols": ["nd4", {"literal":"-"}, "md", "L1X$string$1"], "postprocess": masked()},
    {"name": "L1X$string$2", "symbols": [{"literal":"-"}, {"literal":"X"}, {"literal":"X"}, {"literal":"-"}, {"literal":"X"}, {"literal":"X"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "L1X", "symbols": ["nd4", "L1X$string$2"], "postprocess": masked()},
    {"name": "L1X$string$3", "symbols": [{"literal":"X"}, {"literal":"X"}, {"literal":"X"}, {"literal":"X"}, {"literal":"-"}, {"literal":"X"}, {"literal":"X"}, {"literal":"-"}, {"literal":"X"}, {"literal":"X"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "L1X", "symbols": ["L1X$string$3"], "postprocess": masked()},
    {"name": "L1X$string$4", "symbols": [{"literal":"-"}, {"literal":"X"}, {"literal":"X"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "L1X", "symbols": ["nd4", "L1X$string$4"], "postprocess": masked()},
    {"name": "L1X$string$5", "symbols": [{"literal":"X"}, {"literal":"X"}, {"literal":"X"}, {"literal":"X"}, {"literal":"-"}, {"literal":"X"}, {"literal":"X"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "L1X", "symbols": ["L1X$string$5"], "postprocess": masked()},
    {"name": "L1X$string$6", "symbols": [{"literal":"X"}, {"literal":"X"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "L1X", "symbols": ["nd2", "L1X$string$6"], "postprocess": masked()},
    {"name": "L1X", "symbols": ["nd3", {"literal":"X"}], "postprocess": masked()},
    {"name": "L1X$string$7", "symbols": [{"literal":"X"}, {"literal":"X"}, {"literal":"X"}, {"literal":"X"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "L1X", "symbols": ["L1X$string$7"], "postprocess": masked()},
    {"name": "L1Y", "symbols": [{"literal":"Y"}, "d5+"], "postprocess": data => year([num(data[1])], 1)},
    {"name": "L1Y$string$1", "symbols": [{"literal":"Y"}, {"literal":"-"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "L1Y", "symbols": ["L1Y$string$1", "d5+"], "postprocess": data => year([-num(data[1])], 1)},
    {"name": "UA", "symbols": [{"literal":"?"}], "postprocess": () => ({ uncertain: true })},
    {"name": "UA", "symbols": [{"literal":"~"}], "postprocess": () => ({ approximate: true })},
    {"name": "UA", "symbols": [{"literal":"%"}], "postprocess": () => ({ approximate: true, uncertain: true })},
    {"name": "L1S", "symbols": ["year", {"literal":"-"}, "d21_24"], "postprocess": data => season(data, 1)},
    {"name": "L2", "symbols": ["L2d"], "postprocess": id},
    {"name": "L2", "symbols": ["L2Y"], "postprocess": id},
    {"name": "L2", "symbols": ["L2S"], "postprocess": id},
    {"name": "L2", "symbols": ["L2D"], "postprocess": id},
    {"name": "L2", "symbols": ["L2C"], "postprocess": id},
    {"name": "L2", "symbols": ["L2i"], "postprocess": id},
    {"name": "L2", "symbols": ["set"], "postprocess": id},
    {"name": "L2", "symbols": ["list"], "postprocess": id},
    {"name": "L2d", "symbols": ["ua_date"], "postprocess": id},
    {"name": "L2d", "symbols": ["L2X"], "postprocess": merge(0, { type: 'Date', level: 2 })},
    {"name": "L2D", "symbols": ["decade"], "postprocess": id},
    {"name": "L2D", "symbols": ["decade", "UA"], "postprocess": merge(0, 1)},
    {"name": "L2C", "symbols": ["century"], "postprocess": id},
    {"name": "L2C", "symbols": ["century", "UA"], "postprocess": merge(0, 1, {level: 2})},
    {"name": "ua_date", "symbols": ["ua_year"], "postprocess": qualify},
    {"name": "ua_date", "symbols": ["ua_year_month"], "postprocess": qualify},
    {"name": "ua_date", "symbols": ["ua_year_month_day"], "postprocess": qualify},
    {"name": "ua_year", "symbols": ["UA", "year"], "postprocess": data => [data]},
    {"name": "ua_year_month$macrocall$2", "symbols": ["year"]},
    {"name": "ua_year_month$macrocall$1$ebnf$1", "symbols": ["UA"], "postprocess": id},
    {"name": "ua_year_month$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ua_year_month$macrocall$1$ebnf$2", "symbols": ["UA"], "postprocess": id},
    {"name": "ua_year_month$macrocall$1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ua_year_month$macrocall$1", "symbols": ["ua_year_month$macrocall$1$ebnf$1", "ua_year_month$macrocall$2", "ua_year_month$macrocall$1$ebnf$2"]},
    {"name": "ua_year_month$macrocall$4", "symbols": ["month"]},
    {"name": "ua_year_month$macrocall$3$ebnf$1", "symbols": ["UA"], "postprocess": id},
    {"name": "ua_year_month$macrocall$3$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ua_year_month$macrocall$3$ebnf$2", "symbols": ["UA"], "postprocess": id},
    {"name": "ua_year_month$macrocall$3$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ua_year_month$macrocall$3", "symbols": ["ua_year_month$macrocall$3$ebnf$1", "ua_year_month$macrocall$4", "ua_year_month$macrocall$3$ebnf$2"]},
    {"name": "ua_year_month", "symbols": ["ua_year_month$macrocall$1", {"literal":"-"}, "ua_year_month$macrocall$3"], "postprocess": pluck(0, 2)},
    {"name": "ua_year_month_day$macrocall$2", "symbols": ["year"]},
    {"name": "ua_year_month_day$macrocall$1$ebnf$1", "symbols": ["UA"], "postprocess": id},
    {"name": "ua_year_month_day$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ua_year_month_day$macrocall$1$ebnf$2", "symbols": ["UA"], "postprocess": id},
    {"name": "ua_year_month_day$macrocall$1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ua_year_month_day$macrocall$1", "symbols": ["ua_year_month_day$macrocall$1$ebnf$1", "ua_year_month_day$macrocall$2", "ua_year_month_day$macrocall$1$ebnf$2"]},
    {"name": "ua_year_month_day", "symbols": ["ua_year_month_day$macrocall$1", {"literal":"-"}, "ua_month_day"], "postprocess": data => [data[0], ...data[2]]},
    {"name": "ua_month_day$macrocall$2", "symbols": ["m31"]},
    {"name": "ua_month_day$macrocall$1$ebnf$1", "symbols": ["UA"], "postprocess": id},
    {"name": "ua_month_day$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ua_month_day$macrocall$1$ebnf$2", "symbols": ["UA"], "postprocess": id},
    {"name": "ua_month_day$macrocall$1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ua_month_day$macrocall$1", "symbols": ["ua_month_day$macrocall$1$ebnf$1", "ua_month_day$macrocall$2", "ua_month_day$macrocall$1$ebnf$2"]},
    {"name": "ua_month_day$macrocall$4", "symbols": ["day"]},
    {"name": "ua_month_day$macrocall$3$ebnf$1", "symbols": ["UA"], "postprocess": id},
    {"name": "ua_month_day$macrocall$3$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ua_month_day$macrocall$3$ebnf$2", "symbols": ["UA"], "postprocess": id},
    {"name": "ua_month_day$macrocall$3$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ua_month_day$macrocall$3", "symbols": ["ua_month_day$macrocall$3$ebnf$1", "ua_month_day$macrocall$4", "ua_month_day$macrocall$3$ebnf$2"]},
    {"name": "ua_month_day", "symbols": ["ua_month_day$macrocall$1", {"literal":"-"}, "ua_month_day$macrocall$3"], "postprocess": pluck(0, 2)},
    {"name": "ua_month_day$macrocall$6", "symbols": ["m30"]},
    {"name": "ua_month_day$macrocall$5$ebnf$1", "symbols": ["UA"], "postprocess": id},
    {"name": "ua_month_day$macrocall$5$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ua_month_day$macrocall$5$ebnf$2", "symbols": ["UA"], "postprocess": id},
    {"name": "ua_month_day$macrocall$5$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ua_month_day$macrocall$5", "symbols": ["ua_month_day$macrocall$5$ebnf$1", "ua_month_day$macrocall$6", "ua_month_day$macrocall$5$ebnf$2"]},
    {"name": "ua_month_day$macrocall$8", "symbols": ["d01_30"]},
    {"name": "ua_month_day$macrocall$7$ebnf$1", "symbols": ["UA"], "postprocess": id},
    {"name": "ua_month_day$macrocall$7$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ua_month_day$macrocall$7$ebnf$2", "symbols": ["UA"], "postprocess": id},
    {"name": "ua_month_day$macrocall$7$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ua_month_day$macrocall$7", "symbols": ["ua_month_day$macrocall$7$ebnf$1", "ua_month_day$macrocall$8", "ua_month_day$macrocall$7$ebnf$2"]},
    {"name": "ua_month_day", "symbols": ["ua_month_day$macrocall$5", {"literal":"-"}, "ua_month_day$macrocall$7"], "postprocess": pluck(0, 2)},
    {"name": "ua_month_day$macrocall$10$string$1", "symbols": [{"literal":"0"}, {"literal":"2"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "ua_month_day$macrocall$10", "symbols": ["ua_month_day$macrocall$10$string$1"]},
    {"name": "ua_month_day$macrocall$9$ebnf$1", "symbols": ["UA"], "postprocess": id},
    {"name": "ua_month_day$macrocall$9$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ua_month_day$macrocall$9$ebnf$2", "symbols": ["UA"], "postprocess": id},
    {"name": "ua_month_day$macrocall$9$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ua_month_day$macrocall$9", "symbols": ["ua_month_day$macrocall$9$ebnf$1", "ua_month_day$macrocall$10", "ua_month_day$macrocall$9$ebnf$2"]},
    {"name": "ua_month_day$macrocall$12", "symbols": ["d01_29"]},
    {"name": "ua_month_day$macrocall$11$ebnf$1", "symbols": ["UA"], "postprocess": id},
    {"name": "ua_month_day$macrocall$11$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ua_month_day$macrocall$11$ebnf$2", "symbols": ["UA"], "postprocess": id},
    {"name": "ua_month_day$macrocall$11$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ua_month_day$macrocall$11", "symbols": ["ua_month_day$macrocall$11$ebnf$1", "ua_month_day$macrocall$12", "ua_month_day$macrocall$11$ebnf$2"]},
    {"name": "ua_month_day", "symbols": ["ua_month_day$macrocall$9", {"literal":"-"}, "ua_month_day$macrocall$11"], "postprocess": pluck(0, 2)},
    {"name": "L2X", "symbols": ["dx4"], "postprocess": masked()},
    {"name": "L2X", "symbols": ["dx4", {"literal":"-"}, "mx"], "postprocess": masked()},
    {"name": "L2X", "symbols": ["dx4", {"literal":"-"}, "mdx"], "postprocess": masked()},
    {"name": "mdx", "symbols": ["m31x", {"literal":"-"}, "d31x"], "postprocess": join},
    {"name": "mdx", "symbols": ["m30x", {"literal":"-"}, "d30x"], "postprocess": join},
    {"name": "mdx$string$1", "symbols": [{"literal":"0"}, {"literal":"2"}, {"literal":"-"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "mdx", "symbols": ["mdx$string$1", "d29x"], "postprocess": join},
    {"name": "L2i", "symbols": ["L2i_date", {"literal":"/"}, "L2i_date"], "postprocess": interval(2)},
    {"name": "L2i", "symbols": ["date_time", {"literal":"/"}, "L2i_date"], "postprocess": interval(2)},
    {"name": "L2i", "symbols": ["L2i_date", {"literal":"/"}, "date_time"], "postprocess": interval(2)},
    {"name": "L2i_date", "symbols": [], "postprocess": nothing},
    {"name": "L2i_date", "symbols": ["ua_date"], "postprocess": id},
    {"name": "L2i_date", "symbols": ["L2X"], "postprocess": id},
    {"name": "L2i_date", "symbols": ["INFINITY"], "postprocess": id},
    {"name": "L2Y", "symbols": ["exp_year"], "postprocess": id},
    {"name": "L2Y", "symbols": ["exp_year", "significant_digits"], "postprocess": merge(0, 1)},
    {"name": "L2Y", "symbols": ["L1Y", "significant_digits"], "postprocess": merge(0, 1, { level: 2 })},
    {"name": "L2Y", "symbols": ["year", "significant_digits"], "postprocess": data => year([data[0]], 2, data[1])},
    {"name": "significant_digits", "symbols": [{"literal":"S"}, "positive_digit"], "postprocess": data => ({ significant: num(data[1]) })},
    {"name": "exp_year", "symbols": [{"literal":"Y"}, "exp"], "postprocess": data => year([data[1]], 2)},
    {"name": "exp_year$string$1", "symbols": [{"literal":"Y"}, {"literal":"-"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "exp_year", "symbols": ["exp_year$string$1", "exp"], "postprocess": data => year([-data[1]], 2)},
    {"name": "exp", "symbols": ["digits", {"literal":"E"}, "digits"], "postprocess": data => num(data[0]) * Math.pow(10, num(data[2]))},
    {"name": "L2S", "symbols": ["year", {"literal":"-"}, "d25_41"], "postprocess": data => season(data, 2)},
    {"name": "decade", "symbols": ["positive_decade"], "postprocess": data => decade(data[0])},
    {"name": "decade$string$1", "symbols": [{"literal":"0"}, {"literal":"0"}, {"literal":"0"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "decade", "symbols": ["decade$string$1"], "postprocess": () => decade(0)},
    {"name": "decade", "symbols": [{"literal":"-"}, "positive_decade"], "postprocess": data => decade(-data[1])},
    {"name": "positive_decade", "symbols": ["positive_digit", "digit", "digit"], "postprocess": num},
    {"name": "positive_decade", "symbols": [{"literal":"0"}, "positive_digit", "digit"], "postprocess": num},
    {"name": "positive_decade$string$1", "symbols": [{"literal":"0"}, {"literal":"0"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "positive_decade", "symbols": ["positive_decade$string$1", "positive_digit"], "postprocess": num},
    {"name": "set", "symbols": ["LSB", "OL", "RSB"], "postprocess": list},
    {"name": "list", "symbols": ["LLB", "OL", "RLB"], "postprocess": list},
    {"name": "LSB", "symbols": [{"literal":"["}], "postprocess": () => ({ type: 'Set' })},
    {"name": "LSB$string$1", "symbols": [{"literal":"["}, {"literal":"."}, {"literal":"."}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "LSB", "symbols": ["LSB$string$1"], "postprocess": () => ({ type: 'Set', earlier: true })},
    {"name": "LLB", "symbols": [{"literal":"{"}], "postprocess": () => ({ type: 'List' })},
    {"name": "LLB$string$1", "symbols": [{"literal":"{"}, {"literal":"."}, {"literal":"."}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "LLB", "symbols": ["LLB$string$1"], "postprocess": () => ({ type: 'List', earlier: true })},
    {"name": "RSB", "symbols": [{"literal":"]"}], "postprocess": nothing},
    {"name": "RSB$string$1", "symbols": [{"literal":"."}, {"literal":"."}, {"literal":"]"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "RSB", "symbols": ["RSB$string$1"], "postprocess": () => ({ later: true })},
    {"name": "RLB", "symbols": [{"literal":"}"}], "postprocess": nothing},
    {"name": "RLB$string$1", "symbols": [{"literal":"."}, {"literal":"."}, {"literal":"}"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "RLB", "symbols": ["RLB$string$1"], "postprocess": () => ({ later: true })},
    {"name": "OL", "symbols": ["LI"], "postprocess": data => [data[0]]},
    {"name": "OL", "symbols": ["OL", "_", {"literal":","}, "_", "LI"], "postprocess": data => [...data[0], data[4]]},
    {"name": "LI", "symbols": ["date"], "postprocess": id},
    {"name": "LI", "symbols": ["ua_date"], "postprocess": id},
    {"name": "LI", "symbols": ["L2X"], "postprocess": id},
    {"name": "LI", "symbols": ["consecutives"], "postprocess": id},
    {"name": "consecutives$string$1", "symbols": [{"literal":"."}, {"literal":"."}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "consecutives", "symbols": ["year_month_day", "consecutives$string$1", "year_month_day"], "postprocess": d => [date$6(d[0]), date$6(d[2])]},
    {"name": "consecutives$string$2", "symbols": [{"literal":"."}, {"literal":"."}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "consecutives", "symbols": ["year_month", "consecutives$string$2", "year_month"], "postprocess": d => [date$6(d[0]), date$6(d[2])]},
    {"name": "consecutives$string$3", "symbols": [{"literal":"."}, {"literal":"."}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "consecutives", "symbols": ["year", "consecutives$string$3", "year"], "postprocess": d => [date$6([d[0]]), date$6([d[2]])]},
    {"name": "L3", "symbols": ["L3i"], "postprocess": id},
    {"name": "L3i", "symbols": ["L3S", {"literal":"/"}, "L3S"], "postprocess": interval(3)},
    {"name": "L3S", "symbols": ["L1S"], "postprocess": id},
    {"name": "L3S", "symbols": ["L2S"], "postprocess": id},
    {"name": "digit", "symbols": ["positive_digit"], "postprocess": id},
    {"name": "digit", "symbols": [{"literal":"0"}], "postprocess": id},
    {"name": "digits", "symbols": ["digit"], "postprocess": id},
    {"name": "digits", "symbols": ["digits", "digit"], "postprocess": join},
    {"name": "nd4", "symbols": ["d4"]},
    {"name": "nd4", "symbols": [{"literal":"-"}, "d4"], "postprocess": join},
    {"name": "nd3", "symbols": ["d3"]},
    {"name": "nd3", "symbols": [{"literal":"-"}, "d3"], "postprocess": join},
    {"name": "nd2", "symbols": ["d2"]},
    {"name": "nd2", "symbols": [{"literal":"-"}, "d2"], "postprocess": join},
    {"name": "d4", "symbols": ["d2", "d2"], "postprocess": join},
    {"name": "d3", "symbols": ["d2", "digit"], "postprocess": join},
    {"name": "d2", "symbols": ["digit", "digit"], "postprocess": join},
    {"name": "d5+", "symbols": ["positive_digit", "d3", "digits"], "postprocess": num},
    {"name": "d1x", "symbols": [/[1-9X]/], "postprocess": id},
    {"name": "dx", "symbols": ["d1x"], "postprocess": id},
    {"name": "dx", "symbols": [{"literal":"0"}], "postprocess": id},
    {"name": "dx2", "symbols": ["dx", "dx"], "postprocess": join},
    {"name": "dx4", "symbols": ["dx2", "dx2"], "postprocess": join},
    {"name": "dx4", "symbols": [{"literal":"-"}, "dx2", "dx2"], "postprocess": join},
    {"name": "md", "symbols": ["m31"], "postprocess": id},
    {"name": "md", "symbols": ["m30"], "postprocess": id},
    {"name": "md$string$1", "symbols": [{"literal":"0"}, {"literal":"2"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "md", "symbols": ["md$string$1"], "postprocess": id},
    {"name": "mx", "symbols": [{"literal":"0"}, "d1x"], "postprocess": join},
    {"name": "mx", "symbols": [/[1X]/, /[012X]/], "postprocess": join},
    {"name": "m31x", "symbols": [/[0X]/, /[13578X]/], "postprocess": join},
    {"name": "m31x", "symbols": [/[1X]/, /[02]/], "postprocess": join},
    {"name": "m31x$string$1", "symbols": [{"literal":"1"}, {"literal":"X"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "m31x", "symbols": ["m31x$string$1"], "postprocess": id},
    {"name": "m30x", "symbols": [/[0X]/, /[469]/], "postprocess": join},
    {"name": "m30x$string$1", "symbols": [{"literal":"1"}, {"literal":"1"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "m30x", "symbols": ["m30x$string$1"], "postprocess": join},
    {"name": "d29x", "symbols": [{"literal":"0"}, "d1x"], "postprocess": join},
    {"name": "d29x", "symbols": [/[1-2X]/, "dx"], "postprocess": join},
    {"name": "d30x", "symbols": ["d29x"], "postprocess": join},
    {"name": "d30x$string$1", "symbols": [{"literal":"3"}, {"literal":"0"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "d30x", "symbols": ["d30x$string$1"], "postprocess": id},
    {"name": "d31x", "symbols": ["d30x"], "postprocess": id},
    {"name": "d31x", "symbols": [{"literal":"3"}, /[1X]/], "postprocess": join},
    {"name": "positive_digit", "symbols": [/[1-9]/], "postprocess": id},
    {"name": "m31$subexpression$1$string$1", "symbols": [{"literal":"0"}, {"literal":"1"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "m31$subexpression$1", "symbols": ["m31$subexpression$1$string$1"]},
    {"name": "m31$subexpression$1$string$2", "symbols": [{"literal":"0"}, {"literal":"3"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "m31$subexpression$1", "symbols": ["m31$subexpression$1$string$2"]},
    {"name": "m31$subexpression$1$string$3", "symbols": [{"literal":"0"}, {"literal":"5"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "m31$subexpression$1", "symbols": ["m31$subexpression$1$string$3"]},
    {"name": "m31$subexpression$1$string$4", "symbols": [{"literal":"0"}, {"literal":"7"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "m31$subexpression$1", "symbols": ["m31$subexpression$1$string$4"]},
    {"name": "m31$subexpression$1$string$5", "symbols": [{"literal":"0"}, {"literal":"8"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "m31$subexpression$1", "symbols": ["m31$subexpression$1$string$5"]},
    {"name": "m31$subexpression$1$string$6", "symbols": [{"literal":"1"}, {"literal":"0"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "m31$subexpression$1", "symbols": ["m31$subexpression$1$string$6"]},
    {"name": "m31$subexpression$1$string$7", "symbols": [{"literal":"1"}, {"literal":"2"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "m31$subexpression$1", "symbols": ["m31$subexpression$1$string$7"]},
    {"name": "m31", "symbols": ["m31$subexpression$1"], "postprocess": id},
    {"name": "m30$subexpression$1$string$1", "symbols": [{"literal":"0"}, {"literal":"4"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "m30$subexpression$1", "symbols": ["m30$subexpression$1$string$1"]},
    {"name": "m30$subexpression$1$string$2", "symbols": [{"literal":"0"}, {"literal":"6"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "m30$subexpression$1", "symbols": ["m30$subexpression$1$string$2"]},
    {"name": "m30$subexpression$1$string$3", "symbols": [{"literal":"0"}, {"literal":"9"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "m30$subexpression$1", "symbols": ["m30$subexpression$1$string$3"]},
    {"name": "m30$subexpression$1$string$4", "symbols": [{"literal":"1"}, {"literal":"1"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "m30$subexpression$1", "symbols": ["m30$subexpression$1$string$4"]},
    {"name": "m30", "symbols": ["m30$subexpression$1"], "postprocess": id},
    {"name": "d01_11", "symbols": [{"literal":"0"}, "positive_digit"], "postprocess": join},
    {"name": "d01_11", "symbols": [{"literal":"1"}, /[0-1]/], "postprocess": join},
    {"name": "d01_12", "symbols": ["d01_11"], "postprocess": id},
    {"name": "d01_12$string$1", "symbols": [{"literal":"1"}, {"literal":"2"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "d01_12", "symbols": ["d01_12$string$1"], "postprocess": id},
    {"name": "d01_13", "symbols": ["d01_12"], "postprocess": id},
    {"name": "d01_13$string$1", "symbols": [{"literal":"1"}, {"literal":"3"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "d01_13", "symbols": ["d01_13$string$1"], "postprocess": id},
    {"name": "d00_14$string$1", "symbols": [{"literal":"0"}, {"literal":"0"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "d00_14", "symbols": ["d00_14$string$1"], "postprocess": id},
    {"name": "d00_14", "symbols": ["d01_13"], "postprocess": id},
    {"name": "d00_14$string$2", "symbols": [{"literal":"1"}, {"literal":"4"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "d00_14", "symbols": ["d00_14$string$2"], "postprocess": id},
    {"name": "d00_23$string$1", "symbols": [{"literal":"0"}, {"literal":"0"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "d00_23", "symbols": ["d00_23$string$1"], "postprocess": id},
    {"name": "d00_23", "symbols": ["d01_23"], "postprocess": id},
    {"name": "d01_23", "symbols": [{"literal":"0"}, "positive_digit"], "postprocess": join},
    {"name": "d01_23", "symbols": [{"literal":"1"}, "digit"], "postprocess": join},
    {"name": "d01_23", "symbols": [{"literal":"2"}, /[0-3]/], "postprocess": join},
    {"name": "d01_29", "symbols": [{"literal":"0"}, "positive_digit"], "postprocess": join},
    {"name": "d01_29", "symbols": [/[1-2]/, "digit"], "postprocess": join},
    {"name": "d01_30", "symbols": ["d01_29"], "postprocess": id},
    {"name": "d01_30$string$1", "symbols": [{"literal":"3"}, {"literal":"0"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "d01_30", "symbols": ["d01_30$string$1"], "postprocess": id},
    {"name": "d01_31", "symbols": ["d01_30"], "postprocess": id},
    {"name": "d01_31$string$1", "symbols": [{"literal":"3"}, {"literal":"1"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "d01_31", "symbols": ["d01_31$string$1"], "postprocess": id},
    {"name": "d00_59$string$1", "symbols": [{"literal":"0"}, {"literal":"0"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "d00_59", "symbols": ["d00_59$string$1"], "postprocess": id},
    {"name": "d00_59", "symbols": ["d01_59"], "postprocess": id},
    {"name": "d01_59", "symbols": ["d01_29"], "postprocess": id},
    {"name": "d01_59", "symbols": [/[345]/, "digit"], "postprocess": join},
    {"name": "d21_24", "symbols": [{"literal":"2"}, /[1-4]/], "postprocess": join},
    {"name": "d25_41", "symbols": [{"literal":"2"}, /[5-9]/], "postprocess": join},
    {"name": "d25_41", "symbols": [{"literal":"3"}, "digit"], "postprocess": join},
    {"name": "d25_41", "symbols": [{"literal":"4"}, /[01]/], "postprocess": join},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", {"literal":" "}], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"]}
];
let ParserStart = "edtf";
var grammar = { Lexer, ParserRules, ParserStart };

const defaults = {
  level: 2,
  types: []
};

function byLevel(a, b) {
  return a.level < b.level ? -1 : a.level > b.level ? 1 : 0
}

function limit(results, { level, types } = defaults) {
  if (!results.length) return results
  if (typeof level !== 'number') level = defaults.level;

  return results.filter(res =>
    (level >= res.level) && (!types || types.includes(res.type)))
}

function best(results) {
  if (results.length < 2) return results[0]

  // If there are multiple results, pick the first
  // one on the lowest level!
  return results.sort(byLevel)[0]
}

function parse(input, constraints = {}) {
  try {
    let nep = parser();
    let res = best(limit(nep.feed(input).results, constraints));

    if (!res) throw new Error('edtf: No possible parsings (@EOS)')

    return res

  } catch (error) {
    error.message += ` for "${input}"`;
    throw error
  }
}

function parser() {
  return new nearley__default['default'].Parser(grammar.ParserRules, grammar.ParserStart)
}

class ExtDateTime {

  static get type() {
    return this.name
  }

  static parse(input) {
    return parse(input, { types: [this.type] })
  }

  static from(input) {
    return (input instanceof this) ? input : new this(input)
  }

  static UTC(...args) {
    let time = Date.UTC(...args);

    // ECMA Date constructor converts 0-99 to 1900-1999!
    if (args[0] >= 0 && args[0] < 100)
      time = adj(new Date(time));

    return time
  }

  get type() {
    return this.constructor.type
  }

  get edtf() {
    return this.toEDTF()
  }

  get isEDTF() {
    return true
  }

  toJSON() {
    return this.toEDTF()
  }

  toString() {
    return this.toEDTF()
  }

  toLocaleString(...args) {
    return this.localize(...args)
  }

  inspect() {
    return this.toEDTF()
  }

  valueOf() {
    return this.min
  }

  [Symbol.toPrimitive](hint) {
    return (hint === 'number') ? this.valueOf() : this.toEDTF()
  }


  covers(other) {
    return (this.min <= other.min) && (this.max >= other.max)
  }

  compare(other) {
    if (other.min == null || other.max == null) return null

    let [a, x, b, y] = [this.min, this.max, other.min, other.max];

    if (a !== b)
      return a < b ? -1 : 1

    if (x !== y)
      return x < y ? -1 : 1

    return 0
  }

  includes(other) {
    let covered = this.covers(other);
    if (!covered || !this[Symbol.iterator]) return covered

    for (let cur of this) {
      if (cur.edtf === other.edtf) return true
    }

    return false
  }

  *until(then) {
    yield this;
    if (this.compare(then)) yield* this.between(then);
  }

  *through(then) {
    yield* this.until(then);
    if (this.compare(then)) yield then;
  }

  *between(then) {
    then = this.constructor.from(then);

    let cur = this;
    let dir = this.compare(then);

    if (!dir) return

    for (;;) {
      cur = cur.next(-dir);
      if (cur.compare(then) !== dir) break
      yield cur;
    }
  }
}

function adj(date, by = 1900) {
  date.setUTCFullYear(date.getUTCFullYear() - by);
  return date.getTime()
}

const keys = Reflect.ownKeys.bind(Reflect);
const descriptor = Object.getOwnPropertyDescriptor.bind(Object);
const define = Object.defineProperty.bind(Object);
const has = Object.prototype.hasOwnProperty;

function mixin(target, ...mixins) {
  for (let source of mixins) {
    inherit(target, source);
    inherit(target.prototype, source.prototype);
  }

  return target
}

function inherit(target, source) {
  for (let key of keys(source)) {
    if (!has.call(target, key)) {
      define(target, key, descriptor(source, key));
    }
  }
}

var locale$6 = "en-US";
var date$5 = {
	approximate: {
		long: "circa %D",
		medium: "ca. %D",
		short: "c. %D"
	},
	uncertain: {
		long: "%D (unspecified)",
		medium: "%D (?)",
		short: "%D (?)"
	}
};
var require$$0 = {
	locale: locale$6,
	date: date$5
};

var locale$5 = "es-ES";
var date$4 = {
	approximate: {
		long: "circa %D",
		medium: "ca. %D",
		short: "c. %D"
	},
	uncertain: {
		long: "%D (?)",
		medium: "%D (?)",
		short: "%D (?)"
	}
};
var require$$1 = {
	locale: locale$5,
	date: date$4
};

var locale$4 = "de-DE";
var date$3 = {
	approximate: {
		long: "circa %D",
		medium: "ca. %D",
		short: "ca. %D"
	},
	uncertain: {
		long: "%D (?)",
		medium: "%D (?)",
		short: "%D (?)"
	}
};
var require$$2 = {
	locale: locale$4,
	date: date$3
};

var locale$3 = "fr-FR";
var date$2 = {
	approximate: {
		long: "circa %D",
		medium: "ca. %D",
		short: "c. %D"
	},
	uncertain: {
		long: "%D (?)",
		medium: "%D (?)",
		short: "%D (?)"
	}
};
var require$$3 = {
	locale: locale$3,
	date: date$2
};

var locale$2 = "it-IT";
var date$1 = {
	approximate: {
		long: "circa %D",
		medium: "ca. %D",
		short: "c. %D"
	},
	uncertain: {
		long: "%D (?)",
		medium: "%D (?)",
		short: "%D (?)"
	}
};
var require$$4 = {
	locale: locale$2,
	date: date$1
};

var locale$1 = "ja-JA";
var date = {
	approximate: {
		long: "%D頃",
		medium: "%D頃",
		short: "%D頃"
	},
	uncertain: {
		long: "%D頃",
		medium: "%D頃",
		short: "%D頃"
	}
};
var require$$5 = {
	locale: locale$1,
	date: date
};

const locale = {};

locale.en = require$$0;
locale.es = require$$1;
locale.de = require$$2;
locale.fr = require$$3;
locale.it = require$$4;
locale.ja = require$$5;

alias('en', 'AU', 'CA', 'GB', 'NZ', 'SA', 'US');
alias('de', 'AT', 'CH', 'DE');
alias('fr', 'CH', 'FR');

function alias(lc, ...args) {
  for (const ct of args) locale[`${lc}-${ct}`] = locale[lc];
}

var localeData = locale;

const { assign } = Object;

const noTime = {
  timeZone: 'UTC',
  timeZoneName: undefined,
  hour: undefined,
  minute: undefined,
  second: undefined
};

const DEFAULTS = [
  {},
  assign({ weekday: undefined, day: undefined, month: undefined }, noTime),
  assign({ weekday: undefined, day: undefined }, noTime),
  assign({}, noTime),
];


function getCacheId(...args) {
  let id = [];

  for (let arg of args) {
    if (arg && typeof arg === 'object') {
      id.push(getOrderedProps(arg));
    } else {
      id.push(arg);
    }
  }

  return JSON.stringify(id)

}

function getOrderedProps(obj) {
  let props = [];
  let keys = Object.getOwnPropertyNames(obj);

  for (let key of keys.sort()) {
    props.push({ [key]: obj[key] });
  }

  return props
}

function getFormat(date, locale, options) {
  let opts = {};

  switch (date.precision) {
  case 3:
    opts.day = 'numeric';
    // eslint-disable-next-line no-fallthrough
  case 2:
    opts.month = 'numeric';
    // eslint-disable-next-line no-fallthrough
  case 1:
    opts.year = 'numeric';
    break
  }

  assign(opts, options, DEFAULTS[date.precision]);

  let id = getCacheId(locale, opts);

  if (!format.cache.has(id)) {
    format.cache.set(id, new Intl.DateTimeFormat(locale, opts));
  }

  return format.cache.get(id)
}

function getPatternsFor(fmt) {
  const { locale, weekday, month, year } = fmt.resolvedOptions();
  const lc = localeData[locale];

  if (lc == null) return null

  const variant = (weekday || month === 'long') ? 'long' :
    (!month || year === '2-digit') ? 'short' : 'medium';

  return {
    approximate: lc.date.approximate[variant],
    uncertain: lc.date.uncertain[variant]
  }
}

function isDMY(type) {
  return type === 'day' || type === 'month' || type === 'year'
}

function mask(date, parts) {
  let string = '';

  for (let { type, value } of parts) {
    string += (isDMY(type) && date.unspecified.is(type)) ?
      value.replace(/./g, 'X') :
      value;
  }

  return string
}

function format(date, locale = 'en-US', options = {}) {
  const fmt = getFormat(date, locale, options);
  const pat = getPatternsFor(fmt);

  if (!date.isEDTF || pat == null) {
    return fmt.format(date)
  }

  let string = (!date.unspecified.value || !fmt.formatToParts) ?
    fmt.format(date) :
    mask(date, fmt.formatToParts(date));


  if (date.approximate.value) {
    string = pat.approximate.replace('%D', string);
  }

  if (date.uncertain.value) {
    string = pat.uncertain.replace('%D', string);
  }

  return string
}

format.cache = new Map();

const { abs: abs$3 } = Math;
const { isArray: isArray$1 } = Array;

const P = new WeakMap();
const U = new WeakMap();
const A = new WeakMap();
const X = new WeakMap();

const PM = [Bitmask.YMD, Bitmask.Y, Bitmask.YM, Bitmask.YMD];

class Date$1 extends global.Date {
  constructor(...args) { // eslint-disable-line complexity
    let precision = 0;
    let uncertain, approximate, unspecified;

    switch (args.length) {
    case 0:
      break

    case 1:
      switch (typeof args[0]) {
      case 'number':
        break

      case 'string':
        args = [Date$1.parse(args[0])];
        // eslint-disable-line no-fallthrough

      case 'object':
        if (isArray$1(args[0]))
          args[0] = { values: args[0] };

        {
          let obj = args[0];

          assert__default['default'](obj != null);
          if (obj.type) assert__default['default'].equal('Date', obj.type);

          if (obj.values && obj.values.length) {
            precision = obj.values.length;
            args = obj.values.slice();

            // ECMA Date constructor needs at least two date parts!
            if (args.length < 2) args.push(0);

            if (obj.offset) {
              if (args.length < 3) args.push(1);
              while (args.length < 5) args.push(0);

              // ECMA Date constructor handles overflows so we
              // simply add the offset!
              args[4] = args[4] + obj.offset;
            }

            args = [ExtDateTime.UTC(...args)];
          }

          ({ uncertain, approximate, unspecified } = obj);
        }
        break

      default:
        throw new RangeError('Invalid time value')
      }

      break

    default:
      precision = args.length;
    }

    super(...args);

    this.precision = precision;

    this.uncertain = uncertain;
    this.approximate = approximate;
    this.unspecified = unspecified;
  }

  set precision(value) {
    P.set(this, (value > 3) ? 0 : Number(value));
  }

  get precision() {
    return P.get(this)
  }

  set uncertain(value) {
    U.set(this, this.bits(value));
  }

  get uncertain() {
    return U.get(this)
  }

  set approximate(value) {
    A.set(this, this.bits(value));
  }

  get approximate() {
    return A.get(this)
  }

  set unspecified(value) {
    X.set(this, new Bitmask(value));
  }

  get unspecified() {
    return X.get(this)
  }

  get atomic() {
    return !(
      this.precision || this.unspecified.value
    )
  }

  get min() {
    // TODO uncertain and approximate

    if (this.unspecified.value && this.year < 0) {
      let values = this.unspecified.max(this.values.map(Date$1.pad));
      values[0] = -values[0];
      return (new Date$1({ values })).getTime()
    }

    return this.getTime()
  }

  get max() {
    // TODO uncertain and approximate
    return (this.atomic) ? this.getTime() : this.next().getTime() - 1
  }

  get year() {
    return this.getUTCFullYear()
  }

  get month() {
    return this.getUTCMonth()
  }

  get date() {
    return this.getUTCDate()
  }

  get hours() {
    return this.getUTCHours()
  }

  get minutes() {
    return this.getUTCMinutes()
  }

  get seconds() {
    return this.getUTCSeconds()
  }

  get values() {
    switch (this.precision) {
    case 1:
      return [this.year]
    case 2:
      return [this.year, this.month]
    case 3:
      return [this.year, this.month, this.date]
    default:
      return [
        this.year, this.month, this.date, this.hours, this.minutes, this.seconds
      ]
    }
  }

  /**
   * Returns the next second, day, month, or year, depending on
   * the current date's precision. Uncertain, approximate and
   * unspecified masks are copied.
   */
  next(k = 1) {
    let { values, unspecified, uncertain, approximate } = this;

    if (unspecified.value) {
      let bc = values[0] < 0;

      values = (k < 0) ^ bc ?
        unspecified.min(values.map(Date$1.pad)) :
        unspecified.max(values.map(Date$1.pad));

      if (bc) values[0] = -values[0];
    }

    values.push(values.pop() + k);

    return new Date$1({ values, unspecified, uncertain, approximate })
  }

  prev(k = 1) {
    return this.next(-k)
  }

  *[Symbol.iterator]() {
    let cur = this;

    while (cur <= this.max) {
      yield cur;
      cur = cur.next();
    }
  }

  toEDTF() {
    if (!this.precision) return this.toISOString()

    let sign = (this.year < 0) ? '-' : '';
    let values = this.values.map(Date$1.pad);

    if (this.unspecified.value)
      return sign + this.unspecified.masks(values).join('-')

    if (this.uncertain.value)
      values = this.uncertain.marks(values, '?');

    if (this.approximate.value) {
      values = this.approximate.marks(values, '~')
        .map(value => value.replace(/(~\?)|(\?~)/, '%'));
    }

    return  sign + values.join('-')
  }

  format(...args) {
    return format(this, ...args)
  }

  static pad(number, idx = 0) {
    if (!idx) { // idx 0 = year, 1 = month, ...
      let k = abs$3(number);

      if (k < 10)   return `000${k}`
      if (k < 100)  return `00${k}`
      if (k < 1000) return `0${k}`

      return `${k}`
    }

    if (idx === 1) number = number + 1;

    return (number < 10) ? `0${number}` : `${number}`
  }

  bits(value) {
    if (value === true)
      value = PM[this.precision];

    return new Bitmask(value)
  }
}

mixin(Date$1, ExtDateTime);

const pad = Date$1.pad;

const { abs: abs$2 } = Math;

const V$5 = new WeakMap();
const S = new WeakMap();

class Year extends ExtDateTime {
  constructor(input) {
    super();

    V$5.set(this, []);

    switch (typeof input) {
    case 'number':
      this.year = input;
      break

    case 'string':
      input = Year.parse(input);
      // eslint-disable-line no-fallthrough

    case 'object':
      if (Array.isArray(input))
        input = { values: input };

      {
        assert__default['default'](input !== null);
        if (input.type) assert__default['default'].equal('Year', input.type);

        assert__default['default'](input.values);
        assert__default['default'](input.values.length);

        this.year = input.values[0];
        this.significant = input.significant;
      }
      break

    case 'undefined':
      this.year = new Date().getUTCFullYear();
      break

    default:
      throw new RangeError('Invalid year value')
    }
  }

  get year() {
    return this.values[0]
  }

  set year(year) {
    this.values[0] = Number(year);
  }

  get significant() {
    return S.get(this)
  }

  set significant(digits) {
    S.set(this, Number(digits));
  }

  get values() {
    return V$5.get(this)
  }

  get min() {
    return ExtDateTime.UTC(this.year, 0)
  }

  get max() {
    return ExtDateTime.UTC(this.year + 1, 0) - 1
  }

  toEDTF() {
    let y = abs$2(this.year);
    let s = this.significant ? `S${this.significant}` : '';

    if (y <= 9999) return `${this.year < 0 ? '-' : ''}${pad(this.year)}${s}`

    // TODO exponential form for ending zeroes

    return `Y${this.year}${s}`
  }
}

const { abs: abs$1, floor: floor$1 } = Math;
const V$4 = new WeakMap();


class Decade extends ExtDateTime {
  constructor(input) {
    super();

    V$4.set(this, []);

    this.uncertain = false;
    this.approximate = false;

    switch (typeof input) {
    case 'number':
      this.decade = input;
      break

    case 'string':
      input = Decade.parse(input);
      // eslint-disable-line no-fallthrough

    case 'object':
      if (Array.isArray(input))
        input = { values: input };

      {
        assert__default['default'](input !== null);
        if (input.type) assert__default['default'].equal('Decade', input.type);

        assert__default['default'](input.values);
        assert__default['default'](input.values.length === 1);

        this.decade = input.values[0];
        this.uncertain = !!input.uncertain;
        this.approximate = !!input.approximate;
      }
      break

    case 'undefined':
      this.year = new Date().getUTCFullYear();
      break

    default:
      throw new RangeError('Invalid decade value')
    }
  }

  get decade() {
    return this.values[0]
  }

  set decade(decade) {
    decade = floor$1(Number(decade));
    assert__default['default'](abs$1(decade) < 1000, `invalid decade: ${decade}`);
    this.values[0] = decade;
  }

  get year() {
    return this.values[0] * 10
  }

  set year(year) {
    this.decade = year / 10;
  }

  get values() {
    return V$4.get(this)
  }

  get min() {
    return Date$1.UTC(this.year, 0)
  }

  get max() {
    return Date$1.UTC(this.year + 10, 0) - 1
  }

  toEDTF() {
    let decade = Decade.pad(this.decade);

    if (this.uncertain)
      decade = decade + '?';

    if (this.approximate)
      decade = (decade + '~').replace(/\?~/, '%');

    return decade
  }

  static pad(number) {
    let k = abs$1(number);
    let sign = (k === number) ? '' : '-';

    if (k < 10)   return `${sign}00${k}`
    if (k < 100)  return `${sign}0${k}`

    return `${number}`
  }
}

const { abs, floor } = Math;
const V$3 = new WeakMap();

class Century extends ExtDateTime {
  constructor(input) {
    super();

    V$3.set(this, []);

    this.uncertain = false;
    this.approximate = false;

    switch (typeof input) {
    case 'number':
      this.century = input;
      break

    case 'string':
      input = Century.parse(input);
      // eslint-disable-line no-fallthrough

    case 'object':
      if (Array.isArray(input))
        input = { values: input };

      {
        assert__default['default'](input !== null);
        if (input.type) assert__default['default'].equal('Century', input.type);

        assert__default['default'](input.values);
        assert__default['default'](input.values.length === 1);

        this.century = input.values[0];
        this.uncertain = !!input.uncertain;
        this.approximate = !!input.approximate;
      }
      break

    case 'undefined':
      this.year = new Date().getUTCFullYear();
      break

    default:
      throw new RangeError('Invalid century value')
    }
  }

  get century() {
    return this.values[0]
  }

  set century(century) {
    century = floor(Number(century));
    assert__default['default'](abs(century) < 100, `invalid century: ${century}`);
    this.values[0] = century;
  }

  get year() {
    return this.values[0] * 100
  }

  set year(year) {
    this.century = year / 100;
  }

  get values() {
    return V$3.get(this)
  }

  get min() {
    return Date$1.UTC(this.year, 0)
  }

  get max() {
    return Date$1.UTC(this.year + 100, 0) - 1
  }

  toEDTF() {
    let century = Century.pad(this.century);

    if (this.uncertain)
      century = century + '?';

    if (this.approximate)
      century = (century + '~').replace(/\?~/, '%');

    return century
  }

  static pad(number) {
    let k = abs(number);
    let sign = (k === number) ? '' : '-';

    if (k < 10)   return `${sign}0${k}`

    return `${number}`
  }
}

const V$2 = new WeakMap();

class Season extends ExtDateTime {
  constructor(input) {
    super();

    V$2.set(this, []);

    switch (typeof input) {
    case 'number':
      this.year = input;
      this.season = arguments[1] || 21;
      break

    case 'string':
      input = Season.parse(input);
      // eslint-disable-line no-fallthrough

    case 'object':
      if (Array.isArray(input))
        input = { values: input };

      {
        assert__default['default'](input !== null);
        if (input.type) assert__default['default'].equal('Season', input.type);

        assert__default['default'](input.values);
        assert__default['default'].equal(2, input.values.length);

        this.year = input.values[0];
        this.season = input.values[1];
      }
      break

    case 'undefined':
      this.year = new Date().getUTCFullYear();
      this.season = 21;
      break

    default:
      throw new RangeError('Invalid season value')
    }
  }

  get year() {
    return this.values[0]
  }

  set year(year) {
    this.values[0] = Number(year);
  }

  get season() {
    return this.values[1]
  }

  set season(season) {
    this.values[1] = validate(Number(season));
  }

  get values() {
    return V$2.get(this)
  }

  next(k = 1) {
    let { season, year } = this;

    switch (true) {
    case (season >= 21 && season <= 36):
      [year, season] = inc(year, season, k, season - (season - 21) % 4, 4);
      break
    case (season >= 37 && season <= 39):
      [year, season] = inc(year, season, k, 37, 3);
      break
    case (season >= 40 && season <= 41):
      [year, season] = inc(year, season, k, 40, 2);
      break
    default:
      throw new RangeError(`Cannot compute next/prev for season ${season}`)
    }

    return new Season(year, season)
  }

  prev(k = 1) {
    return this.next(-k)
  }

  get min() { // eslint-disable-line complexity
    switch (this.season) {
    case 21:
    case 25:
    case 32:
    case 33:
    case 40:
    case 37:
      return ExtDateTime.UTC(this.year, 0)

    case 22:
    case 26:
    case 31:
    case 34:
      return ExtDateTime.UTC(this.year, 3)

    case 23:
    case 27:
    case 30:
    case 35:
    case 41:
      return ExtDateTime.UTC(this.year, 6)

    case 24:
    case 28:
    case 29:
    case 36:
      return ExtDateTime.UTC(this.year, 9)

    case 38:
      return ExtDateTime.UTC(this.year, 4)

    case 39:
      return ExtDateTime.UTC(this.year, 8)

    default:
      return ExtDateTime.UTC(this.year, 0)
    }
  }

  get max() { // eslint-disable-line complexity
    switch (this.season) {
    case 21:
    case 25:
    case 32:
    case 33:
      return ExtDateTime.UTC(this.year, 3) - 1

    case 22:
    case 26:
    case 31:
    case 34:
    case 40:
      return ExtDateTime.UTC(this.year, 6) - 1

    case 23:
    case 27:
    case 30:
    case 35:
      return ExtDateTime.UTC(this.year, 9) - 1

    case 24:
    case 28:
    case 29:
    case 36:
    case 41:
    case 39:
      return ExtDateTime.UTC(this.year + 1, 0) - 1

    case 37:
      return ExtDateTime.UTC(this.year, 5) - 1

    case 38:
      return ExtDateTime.UTC(this.year, 9) - 1

    default:
      return ExtDateTime.UTC(this.year + 1, 0) - 1
    }
  }

  toEDTF() {
    return `${this.year < 0 ? '-' : ''}${pad(this.year)}-${this.season}`
  }
}

function validate(season) {
  if (isNaN(season) || season < 21 || season === Infinity)
    throw new RangeError(`invalid division of year: ${season}`)
  return season
}

function inc(year, season, by, base, size) {
  const m = (season + by) - base;

  return [
    year + Math.floor(m / size),
    validate(base + (m % size + size) % size)
  ]
}

const V$1 = new WeakMap();


class Interval extends ExtDateTime {
  constructor(...args) {
    super();

    V$1.set(this, [null, null]);

    switch (args.length) {
    case 2:
      this.lower = args[0];
      this.upper = args[1];
      break

    case 1:
      switch (typeof args[0]) {
      case 'string':
        args[0] = Interval.parse(args[0]);
        // eslint-disable-line no-fallthrough

      case 'object':
        if (Array.isArray(args[0]))
          args[0] = { values: args[0] };

        {
          let [obj] = args;

          assert__default['default'](obj !== null);
          if (obj.type) assert__default['default'].equal('Interval', obj.type);

          assert__default['default'](obj.values);
          assert__default['default'](obj.values.length < 3);

          this.lower = obj.values[0];
          this.upper = obj.values[1];

          this.earlier = obj.earlier;
          this.later = obj.later;
        }
        break

      default:
        this.lower = args[0];
      }
      break

    case 0:
      break

    default:
      throw new RangeError(`invalid interval value: ${args}`)
    }
  }

  get lower() {
    return this.values[0]
  }

  set lower(value) {
    if (value == null)
      return this.values[0] = null

    if (value === Infinity || value === -Infinity)
      return this.values[0] = Infinity

    value = getDateOrSeasonFrom(value);

    if (value >= this.upper && this.upper != null)
      throw new RangeError(`invalid lower bound: ${value}`)

    this.values[0] = value;
  }

  get upper() {
    return this.values[1]
  }

  set upper(value) {
    if (value == null)
      return this.values[1] = null

    if (value === Infinity)
      return this.values[1] = Infinity

    value = getDateOrSeasonFrom(value);

    if (this.lower !== Infinity && value <= this.lower)
      throw new RangeError(`invalid upper bound: ${value}`)

    this.values[1] =  value;
  }

  get finite() {
    return (this.lower != null && this.lower !== Infinity) &&
      (this.upper != null && this.upper !== Infinity)
  }

  *[Symbol.iterator]() {
    if (!this.finite) throw Error('cannot iterate infinite interval')
    yield* this.lower.through(this.upper);
  }

  get values() {
    return V$1.get(this)
  }

  get min() {
    let v = this.lower;
    return !v ? null : (v === Infinity) ? -Infinity : v.min
  }

  get max() {
    let v = this.upper;
    return !v ? null : (v === Infinity) ? Infinity : v.max
  }

  toEDTF() {
    return this.values
      .map(v => {
        if (v === Infinity) return '..'
        if (!v) return ''
        return v.edtf
      })
      .join('/')
  }
}

function getDateOrSeasonFrom(value) {
  try {
    return Date$1.from(value)
  } catch (de) {
    return Season.from(value)
  }
}

const { isArray } = Array;
const V = new WeakMap();


class List extends ExtDateTime {
  constructor(...args) {
    super();

    V.set(this, []);

    if (args.length > 1) args = [args];

    if (args.length) {
      switch (typeof args[0]) {
      case 'string':
        args[0] = new.target.parse(args[0]);
        // eslint-disable-line no-fallthrough

      case 'object':
        if (isArray(args[0]))
          args[0] = { values: args[0] };

        {
          let [obj] = args;

          assert__default['default'](obj !== null);
          if (obj.type) assert__default['default'].equal(this.type, obj.type);

          assert__default['default'](obj.values);
          this.concat(...obj.values);

          this.earlier = !!obj.earlier;
          this.later = !!obj.later;
        }
        break

      default:
        throw new RangeError(`invalid ${this.type} value: ${args}`)
      }
    }
  }

  get values() {
    return V.get(this)
  }

  get length() {
    return this.values.length
  }

  get empty() {
    return this.length === 0
  }

  get first() {
    let value = this.values[0];
    return isArray(value) ? value[0] : value
  }

  get last() {
    let value = this.values[this.length - 1];
    return isArray(value) ? value[0] : value
  }

  clear() {
    return (this.values.length = 0), this
  }

  concat(...args) {
    for (let value of args) this.push(value);
    return this
  }

  push(value) {
    if (isArray(value)) {
      assert__default['default'].equal(2, value.length);
      return this.values.push(value.map(v => Date$1.from(v)))
    }

    return this.values.push(Date$1.from(value))
  }

  *[Symbol.iterator]() {
    for (let value of this.values) {
      if (isArray(value))
        yield* value[0].through(value[1]);
      else
        yield value;
    }
  }

  get min() {
    return this.earlier ? -Infinity : (this.empty ? 0 : this.first.min)
  }

  get max() {
    return this.later ? Infinity : (this.empty ? 0 : this.last.max)
  }

  content() {
    return this
      .values
      .map(v => isArray(v) ? v.map(d => d.edtf).join('..') : v.edtf)
      .join(',')
  }

  toEDTF() {
    return this.wrap(this.empty ?
      '' :
      `${this.earlier ? '..' : ''}${this.content()}${this.later ? '..' : ''}`
    )
  }

  wrap(content) {
    return `{${content}}`
  }
}

class Set extends List {
  static parse(input) {
    return parse(input, { types: ['Set'] })
  }

  get type() {
    return 'Set'
  }

  wrap(content) {
    return `[${content}]`
  }
}

var types = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Date: Date$1,
  Year: Year,
  Decade: Decade,
  Century: Century,
  Season: Season,
  Interval: Interval,
  List: List,
  Set: Set
});

const UNIX_TIME = /^\d{5,}$/;

function edtf(...args) {
  if (!args.length)
    return new Date$1()

  if (args.length === 1) {
    switch (typeof args[0]) {
    case 'object':
      return new (types[args[0].type] || Date$1)(args[0])
    case 'number':
      return new Date$1(args[0])
    case 'string':
      if ((UNIX_TIME).test(args[0]))
        return new Date$1(Number(args[0]))
    }
  }

  let res = parse(...args);
  return new types[res.type](res)
}

exports.Bitmask = Bitmask;
exports.Century = Century;
exports.Date = Date$1;
exports.Decade = Decade;
exports.Interval = Interval;
exports.List = List;
exports.Season = Season;
exports.Set = Set;
exports.Year = Year;
exports['default'] = edtf;
exports.defaults = defaults;
exports.format = format;
exports.parse = parse;
