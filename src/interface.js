import { parse } from './parser.js'

export class ExtDateTime {

  static get type() {
    return this.name
  }

  static parse(input) {
    return parse(input, { types: [this.type] })
  }

  static from(input) {
    return (input instanceof this) ? input : new this(input)
  }

  static UTC(...args) {
    let time = Date.UTC(...args)

    // ECMA Date constructor converts 0-99 to 1900-1999!
    if (args[0] >= 0 && args[0] < 100)
      time = adj(new Date(time))

    return time
  }

  get type() {
    return this.constructor.type
  }

  get edtf() {
    return this.toEDTF()
  }

  get isEDTF() {
    return true
  }

  toJSON() {
    return this.toEDTF()
  }

  toString() {
    return this.toEDTF()
  }

  toLocaleString(...args) {
    return this.localize(...args)
  }

  inspect() {
    return this.toEDTF()
  }

  valueOf() {
    return this.min
  }

  [Symbol.toPrimitive](hint) {
    return (hint === 'number') ? this.valueOf() : this.toEDTF()
  }


  covers(other) {
    return (this.min <= other.min) && (this.max >= other.max)
  }

  compare(other) {
    if (other.min == null || other.max == null) return null

    let [a, x, b, y] = [this.min, this.max, other.min, other.max]

    if (a !== b)
      return a < b ? -1 : 1

    if (x !== y)
      return x < y ? -1 : 1

    return 0
  }

  includes(other) {
    let covered = this.covers(other)
    if (!covered || !this[Symbol.iterator]) return covered

    for (let cur of this) {
      if (cur.edtf === other.edtf) return true
    }

    return false
  }

  *until(then) {
    yield this
    if (this.compare(then)) yield* this.between(then)
  }

  *through(then) {
    yield* this.until(then)
    if (this.compare(then)) yield then
  }

  *between(then) {
    then = this.constructor.from(then)

    let cur = this
    let dir = this.compare(then)

    if (!dir) return

    for (;;) {
      cur = cur.next(-dir)
      if (cur.compare(then) !== dir) break
      yield cur
    }
  }
}

function adj(date, by = 1900) {
  date.setUTCFullYear(date.getUTCFullYear() - by)
  return date.getTime()
}
