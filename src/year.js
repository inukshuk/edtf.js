'use strict'

const assert = require('assert')
const { parse } = require('./parser')
const { pad } = require('./date')
const { abs } = Math

const V = new WeakMap()
const S = new WeakMap()

class Year {
  static parse(input) {
    return parse(input, { types: ['Year'] })
  }

  constructor(input) {
    V[this] = []

    switch (typeof input) {
    case 'number':
      this.year = input
      break

    case 'string':
      input = Year.parse(input)
      // eslint-disable-line no-fallthrough

    case 'object':
      if (Array.isArray(input))
        input = { values: input }

      {
        assert(input !== null)
        if (input.type) assert.equal('Year', input.type)

        assert(input.values)
        assert(input.values.length)

        this.year = input.values[0]
        this.significant = input.significant
      }
      break

    case 'undefined':
      this.year = new Date().getUTCFullYear()
      break

    default:
      throw new RangeError('Invalid year value')
    }
  }

  get type() {
    return 'Year'
  }

  get year() {
    return this.values[0]
  }

  set year(year) {
    return this.values[0] = Number(year)
  }

  get significant() {
    return S[this]
  }

  set significant(digits) {
    return S[this] = Number(digits)
  }

  get values() {
    return V[this]
  }

  get edtf() {
    return this.toEDTF()
  }

  get min() {
    return Date.UTC(this.year, 0)
  }

  get max() {
    return Date.UTC(this.year, 11, 31, 24, 0, 0)
  }

  toEDTF() {
    let y = abs(this.year)
    let s = this.significant ? `S${this.significant}` : ''

    if (y < 9999) return `${pad(this.year)}${s}`

    // TODO exponential form for ending zeroes

    return `Y${this.year}${s}`
  }
}

module.exports = Year
