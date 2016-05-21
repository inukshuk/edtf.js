'use strict'

const assert = require('assert')
const ExtDate = require('./date')
const { parse } = require('./parser')
const { abs, floor } = Math

const V = new WeakMap()


class Decade {
  static parse(input) {
    return parse(input, { types: ['Decade'] })
  }

  static from(input) {
    return (input instanceof Decade) ? input : new Decade(input)
  }

  constructor(input) {
    V.set(this, [])

    this.uncertain = false
    this.approximate = false

    switch (typeof input) {
    case 'number':
      this.decade = input
      break

    case 'string':
      input = Decade.parse(input)
      // eslint-disable-line no-fallthrough

    case 'object':
      if (Array.isArray(input))
        input = { values: input }

      {
        assert(input !== null)
        if (input.type) assert.equal('Decade', input.type)

        assert(input.values)
        assert(input.values.length === 1)

        this.decade = input.values[0]
        this.uncertain = !!input.uncertain
        this.approximate = !!input.approximate
      }
      break

    case 'undefined':
      this.year = new Date().getUTCFullYear()
      break

    default:
      throw new RangeError('Invalid decade value')
    }
  }

  get type() {
    return 'Decade'
  }

  get decade() {
    return this.values[0]
  }

  set decade(decade) {
    decade = floor(Number(decade))
    assert(abs(decade) < 1000, `invalid decade: ${decade}`)
    return this.values[0] = decade
  }

  get year() {
    return this.values[0] * 10
  }

  set year(year) {
    return this.decade = year / 10
  }

  get values() {
    return V.get(this)
  }

  get edtf() {
    return this.toEDTF()
  }

  get min() {
    return ExtDate.UTC(this.year, 0)
  }

  get max() {
    return ExtDate.UTC(this.year + 10, 0) - 1
  }

  toEDTF() {
    let decade = Decade.pad(this.decade)

    if (this.uncertain)
      decade = decade + '?'

    if (this.approximate)
      decade = (decade + '~').replace(/\?~/, '%')

    return decade
  }

  static pad(number) {
    let k = abs(number)
    let sign = (k === number) ? '' : '-'

    if (k < 10)   return `${sign}00${k}`
    if (k < 100)  return `${sign}0${k}`

    return `${number}`
  }
}

Decade.prototype.includes = ExtDate.prototype.includes
Decade.prototype.covers = ExtDate.prototype.covers

module.exports = Decade
