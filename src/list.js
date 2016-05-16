'use strict'

const assert = require('assert')
const { parse } = require('./parser')
const { isArray } = Array

const V = new WeakMap()


class List {
  static parse(input) {
    return parse(input, { types: ['List'] })
  }

  constructor(...args) {
    V[this] = []

    this.earlier = false
    this.later = false

    if (args.length > 1) args = [args]

    if (args.length) {
      switch (typeof args[0]) {
      case 'string':
        args[0] = this.parse(args[0])
        // eslint-disable-line no-fallthrough

      case 'object':
        if (isArray(args[0]))
          args[0] = { values: args[0] }

        {
          let [obj] = args

          assert(obj !== null)
          if (obj.type) assert.equal(this.type, obj.type)

          assert(obj.values)
          this.concat(obj.values)
        }
        break

      default:
        throw new RangeError(`invalid ${this.type} value: ${args}`)
      }
    }
  }

  get type() {
    return 'List'
  }

  get values() {
    return V[this]
  }

  get length() {
    return this.values.length
  }

  get empty() {
    return this.length === 0
  }

  get first() {
    return this.values[0] // todo consecutives
  }

  get last() {
    return this.values[this.length - 1] // todo consecutives
  }

  *[Symbol.iterator]() {
    for (let value of this.values) {
      if (isArray(value))
        yield* value[0].until(value[1])
      else
        yield value
    }
  }

  entries() {
    return Array.from(this[Symbol.iterator]())
  }

  get edtf() {
    return this.toEDTF()
  }

  get min() {
    return this.earlier ? -Infinity : this.empty ? 0 : this.first.min
  }

  get max() {
    return this.later ? Infinity : this.empty ? 0 : this.last.max
  }

  toEDTF() {
    return this.wrap(
      this.values.map(v =>
        isArray(v) ? v.map(d => d.edtf).join('..') : v.edtf)
    )
  }

  wrap(values) {
    return `{${values.join(',')}}`
  }
}

module.exports = List

