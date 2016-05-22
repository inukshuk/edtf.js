'use strict'

class ExtDateTime {

  static UTC(...args) {
    let time = Date.UTC(...args)

    // ECMA Date constructor converts 0-99 to 1900-1999!
    if (args[0] >= 0 && args[0] < 100)
      time = adj(new Date(time))

    return time
  }

  get edtf() {
    return this.toEDTF()
  }

  toJSON() {
    return this.toEDTF()
  }

  toString() {
    return this.toEDTF()
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

}

function adj(date, by = 1900) {
  date.setUTCFullYear(date.getUTCFullYear() - by)
  return date.getTime()
}

module.exports = ExtDateTime
