const DAY = /^days?$/i
const MONTH = /^months?$/i
const YEAR = /^years?$/i
const SYMBOL = /^[xX]$/
const SYMBOLS = /[xX]/g
const PATTERN = /^[0-9xXdDmMyY]{8}$/
const YYYYMMDD = 'YYYYMMDD'.split('')
const MAXDAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

const { floor, pow, max, min } = Math


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
export class Bitmask {

  static test(a, b) {
    return this.convert(a) & this.convert(b)
  }

  static convert(value = 0) { // eslint-disable-line complexity
    value = value || 0

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

  static values(mask, digit = 0, normalize = true) {
    let num = Bitmask.numbers(mask, digit).split('')
    let values = [Number(num.slice(0, 4).join(''))]

    if (num.length > 4) values.push(Number(num.slice(4, 6).join('')))
    if (num.length > 6) values.push(Number(num.slice(6, 8).join('')))

    return normalize ? Bitmask.normalize(values) : values
  }

  static numbers(mask, digit = 0) {
    return mask.replace(SYMBOLS, digit)
  }

  static normalize(values) {
    if (values.length > 1)
      values[1] = min(11, max(0, values[1] - 1))

    if (values.length > 2)
      values[2] = min(MAXDAYS[values[1]] || NaN, max(1, values[2]))

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

  masks(values, symbol = 'X') {
    let offset = 0

    return values.map(value => {
      let mask = this.mask(value.split(''), offset, symbol)
      offset = offset + mask.length

      return mask.join('')
    })
  }

  // eslint-disable-next-line complexity
  max([year, month, day]) {
    if (!year) return []

    year = Number(
      (this.test(Bitmask.YEAR)) ? this.masks([year], '9')[0] : year
    )

    if (!month) return [year]

    month = Number(month) - 1

    switch (this.test(Bitmask.MONTH)) {
    case Bitmask.MONTH:
      month = 11
      break
    case Bitmask.MX:
      month = (month < 9) ? 8 : 11
      break
    case Bitmask.XM:
      month = (month + 1) % 10
      month = (month < 3) ? month + 9 : month - 1
      break
    }

    if (!day) return [year, month]

    day = Number(day)

    switch (this.test(Bitmask.DAY)) {
    case Bitmask.DAY:
      day = MAXDAYS[month]
      break
    case Bitmask.DX:
      day = min(MAXDAYS[month], day + (9 - (day % 10)))
      break
    case Bitmask.XD:
      day = day % 10

      if (month === 1) {
        day = (day === 9 && !leap(year)) ? day + 10 : day + 20

      } else {
        day = (day < 2) ? day + 30 : day + 20
        if (day > MAXDAYS[month]) day = day - 10
      }

      break
    }

    if (month === 1 && day > 28 && !leap(year)) {
      day = 28
    }

    return [year, month, day]
  }

  // eslint-disable-next-line complexity
  min([year, month, day]) {
    if (!year) return []

    year = Number(
      (this.test(Bitmask.YEAR)) ? this.masks([year], '0')[0] : year
    )

    if (month == null) return [year]

    month = Number(month) - 1

    switch (this.test(Bitmask.MONTH)) {
    case Bitmask.MONTH:
    case Bitmask.XM:
      month = 0
      break
    case Bitmask.MX:
      month = (month < 9) ? 0 : 9
      break
    }

    if (!day) return [year, month]

    day = Number(day)

    switch (this.test(Bitmask.DAY)) {
    case Bitmask.DAY:
      day = 1
      break
    case Bitmask.DX:
      day = max(1, floor(day / 10) * 10)
      break
    case Bitmask.XD:
      day = max(1, day % 10)
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

Bitmask.prototype.is = Bitmask.prototype.test

function leap(year) {
  if (year % 4 > 0) return false
  if (year % 100 > 0) return true
  if (year % 400 > 0) return false
  return true
}

Bitmask.DAY   = Bitmask.D = Bitmask.compute('yyyymmxx')
Bitmask.MONTH = Bitmask.M = Bitmask.compute('yyyyxxdd')
Bitmask.YEAR  = Bitmask.Y = Bitmask.compute('xxxxmmdd')

Bitmask.MD  = Bitmask.M | Bitmask.D
Bitmask.YMD = Bitmask.Y | Bitmask.MD
Bitmask.YM  = Bitmask.Y | Bitmask.M

Bitmask.YYXX = Bitmask.compute('yyxxmmdd')
Bitmask.YYYX = Bitmask.compute('yyyxmmdd')
Bitmask.XXXX = Bitmask.compute('xxxxmmdd')

Bitmask.DX = Bitmask.compute('yyyymmdx')
Bitmask.XD = Bitmask.compute('yyyymmxd')
Bitmask.MX = Bitmask.compute('yyyymxdd')
Bitmask.XM = Bitmask.compute('yyyyxmdd')

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
]
