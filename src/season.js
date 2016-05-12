'use strict'

const assert = require('assert')
const { parse } = require('./parser')
const { pad } = require('./date')

const V = new WeakMap()

class Season {
  static parse(input) {
    return parse(input, { types: ['Season'] })
  }

  constructor(input) {
    V[this] = []

    switch (typeof input) {
    case 'number':
      this.year = input
      this.season = arguments[1] || 21
      break

    case 'string':
      input = Season.parse(input)
      // eslint-disable-line no-fallthrough

    case 'object':
      if (Array.isArray(input))
        input = { values: input }

      {
        assert(input !== null)
        if (input.type) assert.equal('Season', input.type)

        assert(input.values)
        assert.equal(2, input.values.length)

        this.year = input.values[0]
        this.season = input.values[1]
      }
      break

    default:
      this.year = new Date().getUTCFullYear()
      this.season = 21
    }
  }

  get type() {
    return 'Season'
  }

  get year() {
    return this.values[0]
  }

  set year(year) {
    return this.values[0] = Number(year)
  }

  get season() {
    return this.values[1]
  }

  set season(season) {
    return this.values[1] = Number(season)
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
    return `${pad(this.year)}-${this.season}`
  }
}

module.exports = Season
