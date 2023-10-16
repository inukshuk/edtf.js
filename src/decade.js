import assert from './assert.js'
import { Date as ExtDate } from './date.js'
import { ExtDateTime } from './interface.js'

const { abs, floor } = Math
const V = new WeakMap()


export class Decade extends ExtDateTime {
  constructor(input) {
    super()

    V.set(this, [])

    this.uncertain = false
    this.approximate = false

    switch (typeof input) {
    case 'number':
      this.decade = input
      break

    case 'string':
      input = Decade.parse(input)

    // eslint-disable-next-line no-fallthrough
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

  get decade() {
    return this.values[0]
  }

  set decade(decade) {
    decade = floor(Number(decade))
    assert(abs(decade) < 1000, `invalid decade: ${decade}`)
    this.values[0] = decade
  }

  get year() {
    return this.values[0] * 10
  }

  set year(year) {
    this.decade = year / 10
  }

  get values() {
    return V.get(this)
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
