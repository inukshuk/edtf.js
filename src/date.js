import assert from './assert.js'
import { Bitmask } from './bitmask.js'
import { ExtDateTime } from './interface.js'
import { mixin } from './mixin.js'
import { format } from './format.js'

const { abs } = Math
const { isArray } = Array

const P = new WeakMap()
const U = new WeakMap()
const A = new WeakMap()
const X = new WeakMap()

const PM = [Bitmask.YMD, Bitmask.Y, Bitmask.YM, Bitmask.YMD]

export class Date extends globalThis.Date {
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
        args = [Date.parse(args[0])]

      // eslint-disable-next-line no-fallthrough
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

            args = [ExtDateTime.UTC(...args)]
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
    P.set(this, (value > 3) ? 0 : Number(value))
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

  get atomic() {
    return !(
      this.precision || this.unspecified.value
    )
  }

  get min() {
    // TODO uncertain and approximate

    if (this.unspecified.value && this.year < 0) {
      let values = this.unspecified.max(this.values.map(Date.pad))
      values[0] = -values[0]
      return (new Date({ values })).getTime()
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
    let { values, unspecified, uncertain, approximate } = this

    if (unspecified.value) {
      let bc = values[0] < 0

      values = (k < 0) ^ bc ?
        unspecified.min(values.map(Date.pad)) :
        unspecified.max(values.map(Date.pad))

      if (bc) values[0] = -values[0]
    }

    values.push(values.pop() + k)

    return new Date({ values, unspecified, uncertain, approximate })
  }

  prev(k = 1) {
    return this.next(-k)
  }

  *[Symbol.iterator]() {
    let cur = this

    while (cur <= this.max) {
      yield cur
      cur = cur.next()
    }
  }

  toEDTF() {
    if (!this.precision) return this.toISOString()

    let sign = (this.year < 0) ? '-' : ''
    let values = this.values.map(Date.pad)

    if (this.unspecified.value)
      return sign + this.unspecified.masks(values).join('-')

    if (this.uncertain.value)
      values = this.uncertain.marks(values, '?')

    if (this.approximate.value) {
      values = this.approximate.marks(values, '~')
        .map(value => value.replace(/(~\?)|(\?~)/, '%'))
    }

    return  sign + values.join('-')
  }

  format(...args) {
    return format(this, ...args)
  }

  static pad(number, idx = 0) {
    if (!idx) { // idx 0 = year, 1 = month, ...
      let k = abs(number)

      if (k < 10)   return `000${k}`
      if (k < 100)  return `00${k}`
      if (k < 1000) return `0${k}`

      return `${k}`
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

mixin(Date, ExtDateTime)

export const pad = Date.pad
