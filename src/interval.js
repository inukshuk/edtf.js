'use strict'

const assert = require('assert')
const { parse } = require('./parser')

const V = new WeakMap()


class Interval {
  static parse(input) {
    return parse(input, { types: ['Interval'] })
  }

  constructor(...args) {
    V[this] = [null, null]

    switch (args.length) {
    case 2:
      [this.lower, this.upper] = args
      break

    case 1:
      switch (typeof args[0]) {
      case 'string':
        args[0] = Interval.parse(args[0])
        // eslint-disable-line no-fallthrough

      case 'object':
        if (Array.isArray(args[0]))
          args[0] = { values: args[0] }

        {
          let [obj] = args

          assert(obj !== null)
          if (obj.type) assert.equal('Interval', obj.type)

          assert(obj.values)
          assert(obj.values.length < 3)

          ;[this.lower, this.upper] = obj.values
        }
        break

      default:
        this.lower = args[0]
      }
      break

    case 0:
      break

    default:
      throw new RangeError(`invalid interval value: ${args}`)
    }
  }

  get type() {
    return 'Interval'
  }


  get lower() {
    return this.values[0]
  }

  set lower(value) {
    this.values[0] = value // todo
  }

  get upper() {
    return this.values[1]
  }

  set upper(value) {
    this.values[1] = value // todo
  }

  get values() {
    return V[this]
  }

  get earlier() {
  }

  get later() {
  }

  get edtf() {
    return this.toEDTF()
  }

  get min() {
    return this.lower.min
  }

  get max() {
    return this.upper.max
  }

  toEDTF() {
    return this.values
      .map(v => {
        if (!v) return ''
        if (v === Infinity) return '*'
        return v.edtf
      })
      .join('/')
  }
}

module.exports = Interval
