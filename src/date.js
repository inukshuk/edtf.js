'use strict'

const assert = require('assert')

const Bitmask = require('./bitmask')
const { parse } = require('./parser')
const { abs } = Math
const { isArray } = Array

const P = new WeakMap()
const U = new WeakMap()
const A = new WeakMap()
const X = new WeakMap()

const PM = [Bitmask.YMD, Bitmask.Y, Bitmask.YM, Bitmask.YMD]

class ExtDate extends Date {

  static parse(input) {
    return parse(input, { types: ['Date'] })
  }

  static from(input) {
    return (input instanceof ExtDate) ? input : new ExtDate(input)
  }

  constructor(...args) { // eslint-disable-line complexity
    let precision = 0
    let uncertain, approximate, unspecified

    switch (args.length) {
    case 0:
      break

    case 1:
      switch (typeof args[0]) {
      case 'number':
        break

      case 'string':
        args = [ExtDate.parse(args[0])]
        // eslint-disable-line no-fallthrough

      case 'object':
        if (isArray(args[0]))
          args[0] = { values: args[0] }

        {
          let obj = args[0]

          assert(obj != null)
          if (obj.type) assert.equal('Date', obj.type)

          if (obj.values && obj.values.length) {
            precision = obj.values.length
            args = obj.values.slice()

            // ECMA Date constructor needs at least two date parts!
            if (args.length < 2) args.push(0)

            if (obj.offset) {
              if (args.length < 3) args.push(1)
              while (args.length < 5) args.push(0)

              // ECMA Date constructor handles overflows so we
              // simply add the offset!
              args[4] = args[4] + obj.offset
            }

            args = [Date.UTC(...args)]

            // ECMA Date constructor converts 0-99 to 1900-1999!
            if (obj.values[0] >= 0 && obj.values[0] < 100)
              args[0] = adj(new Date(args[0]))

          }

          ({ uncertain, approximate, unspecified } = obj)
        }
        break

      default:
        throw new RangeError('Invalid time value')
      }

      break

    default:
      precision = args.length
    }

    super(...args)

    this.precision = precision

    this.uncertain = uncertain
    this.approximate = approximate
    this.unspecified = unspecified
  }


  set precision(value) {
    P.set(this, Number(value) % 4)
  }

  get precision() {
    return P.get(this)
  }

  set uncertain(value) {
    U.set(this, this.bits(value))
  }

  get uncertain() {
    return U.get(this)
  }

  set approximate(value) {
    A.set(this, this.bits(value))
  }

  get approximate() {
    return A.get(this)
  }

  set unspecified(value) {
    X.set(this, new Bitmask(value))
  }

  get unspecified() {
    return X.get(this)
  }

  get type() {
    return 'Date'
  }

  get edtf() {
    return this.toEDTF()
  }

  get min() {
    // todo uncertain and approximate
    return this.getTime()
  }

  get max() {
    //if (this.unspecified.value) {
    //}

    // todo uncertain and approximate

    if (this.precision)
      return this.next().getTime() - 1

    return this.getTime()
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
   * Returns the next day, month, or year, depending on
   * the current date's precision. Uncertain, approximate
   * and unspecified masks are copied.
   */
  next(k = 1) {
    let { values, unspecified, uncertain, approximate } = this

    values = values.slice(0, 3)
    values.push(values.pop() + k)

    return new ExtDate({ values, unspecified, uncertain, approximate })
  }

  prev(k = 1) {
    return this.next(-k)
  }

  *until(then) {
    yield this

    if (!this.compare(then)) return

    yield* this.between(then)
    yield then
  }

  *between(then) {
    let cur = this
    let dir = this.compare(then)

    for (;;) {
      cur = cur.next(-dir)
      dir = cur.compare(then)

      if (!dir) break
      yield cur
    }
  }

  compare(other) {
    let [a, x, b, y] = [this.min, this.max, other.min, other.max]

    if (a !== b)
      return a < b ? -1 : 1

    if (x !== y)
      return x < y ? -1 : 1

    return 0
  }

  toEDTF() {
    if (!this.precision) return this.toISOString()

    let values = this.values.map(ExtDate.pad)

    if (this.unspecified.value)
      return this.unspecified.masks(values).join('-')

    if (this.uncertain.value)
      values = this.uncertain.marks(values, '?')

    if (this.approximate.value) {
      values = this.approximate.marks(values, '~')
        .map(value => value.replace(/(~\?)|(\?~)/, '%'))
    }

    return values.join('-')
  }

  [Symbol.toPrimitive](hint) {
    return (hint === 'number') ? this.valueOf() : this.toEDTF()
  }

  static pad(number, idx = 0) { // idx 0 = year, 1 = month, ...
    if (!idx) {
      let k = abs(number)
      let sign = (k === number) ? '' : '-'

      if (k < 10)   return `${sign}000${k}`
      if (k < 100)  return `${sign}00${k}`
      if (k < 1000) return `${sign}0${k}`

      return `${number}`
    }

    if (idx === 1) number = number + 1

    return (number < 10) ? `0${number}` : `${number}`
  }

  bits(value) {
    if (value === true)
      value = PM[this.precision]

    return new Bitmask(value)
  }
}

Object.assign(ExtDate.prototype, {
  toJSON: ExtDate.prototype.toEDTF,
  toString: ExtDate.prototype.toEDTF,
  inspect: ExtDate.prototype.toEDTF
})



function adj(date, by = 1900) {
  date.setUTCFullYear(date.getUTCFullYear() - by)
  return date.getTime()
}

module.exports = ExtDate
