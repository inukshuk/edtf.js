'use strict'

const DAY = /^days?$/i
const MONTH = /^months?$/i
const YEAR = /^years?$/i
const SYMBOL = /^[xX~?]$/
const PATTERN = /^[yYxX~?]{4}[mMxX~?]{2}[dDxX~?]{2}$/
const YYYYMMDD = 'YYYYMMDD'.split('')

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
        if (PATTERN.test(value)) return this.compute(value)
        // fall through!

      default:
        throw new Error(`invalid value: ${value}`)
    }
  }

  static compute(value) {
    return value.split('').reduce((memo, c, idx) =>
        (memo | (SYMBOL.test(c) ? pow(2, idx) : 0)), 0)
  }


  constructor(value = 0) {
    this.value = Bitmask.convert(value)
  }

  test(value = 0) {
    return this.value & Bitmask.convert(value)
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
    return input.map((c, idx) => this.test(pow(2, offset + idx)) ? symbol : c)
  }

  toJSON() {
    return this.value
  }

  toString() {
    return this.value.toString(2)
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
