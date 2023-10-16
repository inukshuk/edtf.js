import assert from './assert.js'
import { Date as ExtDate } from './date.js'
import { ExtDateTime } from './interface.js'

const { abs, floor } = Math
const V = new WeakMap()

export class Century extends ExtDateTime {
  constructor(input) {
    super()

    V.set(this, [])

    this.uncertain = false
    this.approximate = false

    switch (typeof input) {
    case 'number':
      this.century = input
      break

    case 'string':
      input = Century.parse(input)

    // eslint-disable-next-line no-fallthrough
    case 'object':
      if (Array.isArray(input))
        input = { values: input }

      {
        assert(input !== null)
        if (input.type) assert.equal('Century', input.type)

        assert(input.values)
        assert(input.values.length === 1)

        this.century = input.values[0]
        this.uncertain = !!input.uncertain
        this.approximate = !!input.approximate
      }
      break

    case 'undefined':
      this.year = new Date().getUTCFullYear()
      break

    default:
      throw new RangeError('Invalid century value')
    }
  }

  get century() {
    return this.values[0]
  }

  set century(century) {
    century = floor(Number(century))
    assert(abs(century) < 100, `invalid century: ${century}`)
    this.values[0] = century
  }

  get year() {
    return this.values[0] * 100
  }

  set year(year) {
    this.century = year / 100
  }

  get values() {
    return V.get(this)
  }

  get min() {
    return ExtDate.UTC(this.year, 0)
  }

  get max() {
    return ExtDate.UTC(this.year + 100, 0) - 1
  }

  toEDTF() {
    let century = Century.pad(this.century)

    if (this.uncertain)
      century = century + '?'

    if (this.approximate)
      century = (century + '~').replace(/\?~/, '%')

    return century
  }

  static pad(number) {
    let k = abs(number)
    let sign = (k === number) ? '' : '-'

    if (k < 10)   return `${sign}0${k}`

    return `${number}`
  }
}
