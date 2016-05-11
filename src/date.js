'use strict'

const assert = require('assert')

const { parse } = require('./parser')
const Bitmask = require('./bitmask')

const P = new WeakMap()
const U = new WeakMap()
const A = new WeakMap()
const X = new WeakMap()


class ExtDate extends Date {
  static parse(input) {
    return parse(input, { types: ['Date'] })
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
        args = ExtDate.parse(args[0])
        // eslint-disable-line no-fallthrough

      case 'object':
        if (Array.isArray(args[0]))
          args[0] = { type: 'Date', values: args[0] }

        {
          let obj = args[0]

          assert(obj !== null)
          if (obj.type) assert.equal('Date', obj.type)

          assert(obj.values)
          assert(obj.values.length)

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
            args[0] = adj(new Date(args[0]));

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
    P[this] = Number(value) % 4
  }

  get precision() {
    return P[this]
  }

  set uncertain(value) {
    U[this] = new Bitmask(value)
  }

  get uncertain() {
    return U[this]
  }

  set approximate(value) {
    A[this] = new Bitmask(value)
  }

  get approximate() {
    return A[this]
  }

  set unspecified(value) {
    X[this] = new Bitmask(value)
  }

  get unspecified() {
    return X[this]
  }

  get type() {
    return 'Date'
  }

  get edtf() {
    return this.toEDTF()
  }

  get min() {
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

  toEDTF() {
    if (!this.precision) return this.toISOString()

    let values = this.values.map(pad)

    if (this.unspecified.value)
      return this.unspecified.masks(values).join('-')

    if (this.uncertain.value)
      values = this.uncertain.marks(values, '?')

    if (this.approximate.value) {
      values = this.approximate.marks(values, '~')
        .map(value => value.replace(/~\?/, '%'))
    }

    return values.join('-')
  }

  [Symbol.toPrimitive](hint) {
    return (hint === 'number') ? this.valueOf() : this.toISOString()
  }
}

ExtDate.prototype.toJSON = ExtDate.prototype.toEDTF

function adj(date, by = 1900) {
  date.setUTCFullYear(date.getUTCFullYear() - by)
  return date.getTime()
}

function pad(number, idx = 0) { // idx 0 = year, 1 = month, ...
  if (!idx) {
    let abs = Math.abs(number)
    let sign = (abs === number) ? '' : '-'

    if (abs < 10)   return `${sign}000${abs}`
    if (abs < 100)  return `${sign}00${abs}`
    if (abs < 1000) return `${sign}0${abs}`

    return `${number}`
  }

  if (idx === 1) number = number + 1

  return (number < 10) ? `0${number}` : `${number}`
}

module.exports = ExtDate
