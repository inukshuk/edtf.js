import assert from './assert.js'
import { Bitmask } from './bitmask.js'
import { ExtDateTime } from './interface.js'
import { pad } from './date.js'

const A = new WeakMap()
const U = new WeakMap()
const V = new WeakMap()
const X = new WeakMap()

export class Season extends ExtDateTime {
  constructor(input) {
    super()
    let uncertain, approximate, unspecified

    V.set(this, [])

    switch (typeof input) {
    case 'number':
      this.year = input
      this.season = arguments[1] || 21
      break

    case 'string':
      input = Season.parse(input)

    // eslint-disable-next-line no-fallthrough
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

        ;({ unspecified, uncertain, approximate } = input)

      }
      break

    case 'undefined':
      this.year = new Date().getUTCFullYear()
      this.season = 21
      break

    default:
      throw new RangeError('Invalid season value')
    }

    this.unspecified = unspecified
    this.uncertain = uncertain
    this.approximate = approximate
  }

  get year() {
    return this.values[0]
  }

  set year(year) {
    this.values[0] = Number(year)
  }

  get season() {
    return this.values[1]
  }

  set season(season) {
    this.values[1] = validate(Number(season))
  }

  get values() {
    return V.get(this)
  }

  set uncertain(value) {
    U.set(this, new Bitmask(value))
  }

  get uncertain() {
    return U.get(this)
  }

  set approximate(value) {
    A.set(this, new Bitmask(value))
  }

  get approximate() {
    return A.get(this)
  }

  set unspecified(value) {
    X.set(this, new Bitmask(value))
  }

  get unspecified() {
    return X.get(this)
  }

  next(k = 1) {
    let { season, year, unspecified, approximate, uncertain } = this

    switch (true) {
    case (season >= 21 && season <= 36):
      [year, season] = inc(year, season, k, season - (season - 21) % 4, 4)
      break
    case (season >= 37 && season <= 39):
      [year, season] = inc(year, season, k, 37, 3)
      break
    case (season >= 40 && season <= 41):
      [year, season] = inc(year, season, k, 40, 2)
      break
    default:
      throw new RangeError(`Cannot compute next/prev for season ${season}`)
    }

    return new Season({
      values: [year, season],
      approximate,
      uncertain,
      unspecified
    })
  }

  prev(k = 1) {
    return this.next(-k)
  }

  get min() { // eslint-disable-line complexity
    switch (this.season) {
    case 21:
    case 25:
    case 32:
    case 33:
    case 40:
    case 37:
      return ExtDateTime.UTC(this.year, 0)

    case 22:
    case 26:
    case 31:
    case 34:
      return ExtDateTime.UTC(this.year, 3)

    case 23:
    case 27:
    case 30:
    case 35:
    case 41:
      return ExtDateTime.UTC(this.year, 6)

    case 24:
    case 28:
    case 29:
    case 36:
      return ExtDateTime.UTC(this.year, 9)

    case 38:
      return ExtDateTime.UTC(this.year, 4)

    case 39:
      return ExtDateTime.UTC(this.year, 8)

    default:
      return ExtDateTime.UTC(this.year, 0)
    }
  }

  get max() { // eslint-disable-line complexity
    let year = this.unspecified.max([pad(this.year)])

    switch (this.season) {
    case 21:
    case 25:
    case 32:
    case 33:
      return ExtDateTime.UTC(year, 3) - 1

    case 22:
    case 26:
    case 31:
    case 34:
    case 40:
      return ExtDateTime.UTC(year, 6) - 1

    case 23:
    case 27:
    case 30:
    case 35:
      return ExtDateTime.UTC(year, 9) - 1

    case 24:
    case 28:
    case 29:
    case 36:
    case 41:
    case 39:
      return ExtDateTime.UTC(year + 1, 0) - 1

    case 37:
      return ExtDateTime.UTC(year, 5) - 1

    case 38:
      return ExtDateTime.UTC(year, 9) - 1

    default:
      return ExtDateTime.UTC(year + 1, 0) - 1
    }
  }

  toEDTF() {
    let sign = (this.year < 0) ? '-' : ''
    let values = [pad(this.year), String(this.season)]

    if (this.unspecified.value)
      return sign + this.unspecified.masks(values).join('-')

    if (this.uncertain.value)
      values = this.uncertain.marks(values, '?')

    if (this.approximate.value) {
      values = this.approximate.marks(values, '~')
        .map(value => value.replace(/(~\?)|(\?~)/, '%'))
    }

    return  sign + values.join('-')
  }
}

function validate(season) {
  if (isNaN(season) || season < 21 || season === Infinity)
    throw new RangeError(`invalid division of year: ${season}`)
  return season
}

function inc(year, season, by, base, size) {
  const m = (season + by) - base

  return [
    year + Math.floor(m / size),
    validate(base + (m % size + size) % size)
  ]
}
