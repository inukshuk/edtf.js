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
    return parse(input, { types: ['date'] })
  }

  constructor(...args) { // eslint-disable-line complexity
    let precision, uncertain, approximate, unspecified

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
        {
          let obj = args[0]

          assert.equal('Date', obj.type)
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
    P[this] = Number(value)
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


  toISOString() {
    //return super()
  }

  toJSON() {
    return this.toISOString()
  }
}

function adj(date, by = 1900) {
  date.setUTCFullYear(date.getUTCFullYear() - by)
  return date.getTime()
}

module.exports = ExtDate
