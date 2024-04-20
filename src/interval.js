import assert from './assert.js'
import { Date as ExtDate } from './date.js'
import { ExtDateTime } from './interface.js'
import { Season } from './season.js'

const V = new WeakMap()


export class Interval extends ExtDateTime {
  constructor(...args) {
    super()

    V.set(this, [null, null])

    switch (args.length) {
    case 2:
      this.lower = args[0]
      this.upper = args[1]
      break

    case 1:
      switch (typeof args[0]) {
      case 'string':
        args[0] = Interval.parse(args[0])

      // eslint-disable-next-line no-fallthrough
      case 'object':
        if (Array.isArray(args[0]))
          args[0] = { values: args[0] }

        {
          let [obj] = args

          assert(obj !== null)
          if (obj.type) assert.equal('Interval', obj.type)

          assert(obj.values)
          assert(obj.values.length < 3)

          this.lower = obj.values[0]
          this.upper = obj.values[1]

          this.earlier = obj.earlier
          this.later = obj.later
        }
        break

      default:
        this.lower = args[0]
      }
      break

    case 0:
      break

    default:
      throw new RangeError(`invalid interval value: ${args}`)
    }
  }

  get lower() {
    return this.values[0]
  }

  set lower(value) {
    if (value == null)
      return this.values[0] = null

    if (value === Infinity || value === -Infinity)
      return this.values[0] = Infinity

    value = getDateOrSeasonFrom(value)

    if (value >= this.upper && this.upper != null)
      throw new RangeError(`invalid lower bound: ${value}`)

    this.values[0] = value
  }

  get upper() {
    return this.values[1]
  }

  set upper(value) {
    if (value == null)
      return this.values[1] = null

    if (value === Infinity)
      return this.values[1] = Infinity

    value = getDateOrSeasonFrom(value)

    if (this.lower !== null && this.lower !== Infinity && value <= this.lower)
      throw new RangeError(`invalid upper bound: ${value}`)

    this.values[1] =  value
  }

  get finite() {
    return (this.lower != null && this.lower !== Infinity) &&
      (this.upper != null && this.upper !== Infinity)
  }

  *[Symbol.iterator]() {
    if (!this.finite) throw Error('cannot iterate infinite interval')
    yield* this.lower.through(this.upper)
  }

  get values() {
    return V.get(this)
  }

  get min() {
    let v = this.lower
    return !v ? null : (v === Infinity) ? -Infinity : v.min
  }

  get max() {
    let v = this.upper
    return !v ? null : (v === Infinity) ? Infinity : v.max
  }

  toEDTF() {
    return this.values
      .map(v => {
        if (v === Infinity) return '..'
        if (!v) return ''
        return v.edtf
      })
      .join('/')
  }
}

function getDateOrSeasonFrom(value) {
  try {
    return ExtDate.from(value)
  } catch {
    return Season.from(value)
  }
}
