'use strict'

const assert = require('assert')
const ExtDate = require('./date')
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
          this.concat(...obj.values)

          this.earlier = !!obj.earlier
          this.later = !!obj.later
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

  clear() {
    return (this.values.length = 0), this
  }

  concat(...args) {
    for (let value of args) this.push(value)
    return this
  }

  push(value) {
    if (isArray(value)) {
      assert.equal(2, value.length)
      return this.values.push(value.map(ExtDate.from))
    }

    return this.values.push(ExtDate.from(value))
  }

  *[Symbol.iterator]() {
    for (let value of this.values) {
      if (isArray(value))
        yield* value[0].until(value[1])
      else
        yield value
    }
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

  content() {
    return this
      .values
      .map(v => isArray(v) ? v.map(d => d.edtf).join('..') : v.edtf)
      .join(',')
  }

  toEDTF() {
    return this.empty ? '{}' : [
      this.earlier ? '{..' : '{', this.content(), this.later ? '..}' : '}'
    ].join('')
  }
}

module.exports = List
