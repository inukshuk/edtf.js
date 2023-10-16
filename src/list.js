import assert from './assert.js'
import { Date } from './date.js'
import { ExtDateTime } from './interface.js'

const { isArray } = Array
const V = new WeakMap()


export class List extends ExtDateTime {
  constructor(...args) {
    super()

    V.set(this, [])

    if (args.length > 1) args = [args]

    if (args.length) {
      switch (typeof args[0]) {
      case 'string':
        args[0] = new.target.parse(args[0])

      // eslint-disable-next-line no-fallthrough
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

  get values() {
    return V.get(this)
  }

  get length() {
    return this.values.length
  }

  get empty() {
    return this.length === 0
  }

  get first() {
    let value = this.values[0]
    return isArray(value) ? value[0] : value
  }

  get last() {
    let value = this.values[this.length - 1]
    return isArray(value) ? value[0] : value
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
      return this.values.push(value.map(v => Date.from(v)))
    }

    return this.values.push(Date.from(value))
  }

  *[Symbol.iterator]() {
    for (let value of this.values) {
      if (isArray(value))
        yield* value[0].through(value[1])
      else
        yield value
    }
  }

  get min() {
    return this.earlier ? -Infinity : (this.empty ? 0 : this.first.min)
  }

  get max() {
    return this.later ? Infinity : (this.empty ? 0 : this.last.max)
  }

  content() {
    return this
      .values
      .map(v => isArray(v) ? v.map(d => d.edtf).join('..') : v.edtf)
      .join(',')
  }

  toEDTF() {
    return this.wrap(this.empty ?
      '' :
      `${this.earlier ? '..' : ''}${this.content()}${this.later ? '..' : ''}`
    )
  }

  wrap(content) {
    return `{${content}}`
  }
}
