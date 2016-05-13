'use strict'

const assert = require('assert')
const Bitmask = require('./bitmask')
const { parse } = require('./parser')
const { pad } = require('./date')
const { abs, floor } = Math

const V = new WeakMap()
const U = new WeakMap()
const A = new WeakMap()


class Century {
  static parse(input) {
    return parse(input, { types: ['Century'] })
  }

  constructor(input) {
    V[this] = []

    this.uncertain = 0
    this.approximate = 0

    switch (typeof input) {
    case 'number':
      this.century = input
      break

    case 'string':
      input = Century.parse(input)
      // eslint-disable-line no-fallthrough

    case 'object':
      if (Array.isArray(input))
        input = { values: input }

      {
        assert(input !== null)
        if (input.type) assert.equal('Century', input.type)

        assert(input.values)
        assert(input.values.length === 1)

        this.century = input.values[0]
        this.uncertain = input.uncertain
        this.approximate = input.approximate
      }
      break

    default:
      this.year = new Date().getUTCFullYear()
    }
  }

  get type() {
    return 'Century'
  }

  get century() {
    return this.values[0]
  }

  set century(century) {
    decade = floor(Number(decade))
    assert(abs(century) < 100, `invalid century: ${century}`)
    return this.values[0] = century
  }

  get year() {
    return this.values[0] * 100
  }

  set year(year) {
    return this.century = year / 100
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
    return Date.UTC(this.year + 99, 11, 31, 24, 0, 0)
  }

  toEDTF() {
    let century = pad(this.century, 2)

    if (this.uncertain.value)
      century = century + '?'

    if (this.approximate.value)
      century = (century + '~').replace(/\?~/, '%')

    return century
  }
}

module.exports = Century
