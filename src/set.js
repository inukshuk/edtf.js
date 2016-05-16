'use strict'

const List = require('./list')
const { parse } = require('./parser')

class Set extends List {
  static parse(input) {
    return parse(input, { types: ['Set'] })
  }

  constructor(obj) {
    super(...arguments)

    if (obj && typeof obj === 'object') {
      this.earlier = !!obj.earlier
      this.later = !!obj.later
    }
  }

  get type() {
    return 'Set'
  }

  get min() {
    return this.earlier ? -Infinity : super.min
  }

  get max() {
    return this.later ? Infinity : super.max
  }

  toEDTF() {
    return this.empty ? '[]' : [
      this.earlier ? '[..' : '[', this.content(), this.later ? '..]' : ']'
    ].join('')
  }
}

module.exports = Set
