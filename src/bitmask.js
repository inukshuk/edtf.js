'use strict'

const DAY = /^days?$/i
const MONTH = /^months?$/i
const YEAR = /^years?$/i
const SYMBOL = /^[xX~?]$/
const SYMBOLS = /[xX~?]/g
const PATTERN = /^[0-9xX~?]{8}$/
const YYYYMMDD = 'YYYYMMDD'.split('')
const MAXDAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

const { pow } = Math


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
    value = value || 0

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
    let num = Bitmask.numbers(mask, digit).split('')
    let values = [Number(num.slice(0, 4).join(''))]

    if (num.length > 4) values.push(Number(num.slice(4, 6).join('')))
    if (num.length > 6) values.push(Number(num.slice(6, 8).join('')))

    return Bitmask.normalize(values)
  }

  static numbers(mask, digit = 0) {
    return mask.replace(SYMBOLS, digit)
  }

  static normalize(values) {
    if (values.length > 1) {
      values[1] = Math.min(11, Math.max(0, values[1] - 1))
    }

    if (values.length > 2) {
      values[2] = Math.min(MAXDAYS[values[1]] || NaN, Math.max(1, values[2]))
    }

    return values
  }


  constructor(value = 0) {
    this.value = Bitmask.convert(value)
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

  toJSON() {
    return this.value
  }

  toString(symbol = 'X') {
    return [
      this.mask(['Y', 'Y', 'Y', 'Y'], 0, symbol).join(''),
      this.mask(['M', 'M'], 4, symbol).join(''),
      this.mask(['D', 'D'], 6, symbol).join('')
    ].join('-')
  }
}

Bitmask.prototype.is = Bitmask.prototype.test


Bitmask.DAY   = Bitmask.D = Bitmask.compute('yyyymmxx')
Bitmask.MONTH = Bitmask.M = Bitmask.compute('yyyyxxdd')
Bitmask.YEAR  = Bitmask.Y = Bitmask.compute('xxxxmmdd')

Bitmask.MD  = Bitmask.M | Bitmask.D
Bitmask.YMD = Bitmask.Y | Bitmask.MD
Bitmask.YM  = Bitmask.Y | Bitmask.M

Bitmask.YYXX = Bitmask.compute('yyxxmmdd')
Bitmask.YYYX = Bitmask.compute('yyyxmmdd')
Bitmask.XXXX = Bitmask.compute('xxxxmmdd')

module.exports = Bitmask
