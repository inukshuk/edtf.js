import assert from './assert.js'
import { ExtDateTime } from './interface.js'
import { pad } from './date.js'

const { abs } = Math

const V = new WeakMap()
const S = new WeakMap()

export class Year extends ExtDateTime {
  constructor(input) {
    super()

    V.set(this, [])

    switch (typeof input) {
    case 'number':
      this.year = input
      break

    case 'string':
      input = Year.parse(input)

    // eslint-disable-next-line no-fallthrough
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

  get year() {
    return this.values[0]
  }

  set year(year) {
    this.values[0] = Number(year)
  }

  get significant() {
    return S.get(this)
  }

  set significant(digits) {
    S.set(this, Number(digits))
  }

  get values() {
    return V.get(this)
  }

  get min() {
    return ExtDateTime.UTC(this.year, 0)
  }

  get max() {
    return ExtDateTime.UTC(this.year + 1, 0) - 1
  }

  toEDTF() {
    let y = abs(this.year)
    let s = this.significant ? `S${this.significant}` : ''

    if (y <= 9999) return `${this.year < 0 ? '-' : ''}${pad(this.year)}${s}`

    // TODO exponential form for ending zeroes

    return `Y${this.year}${s}`
  }
}
