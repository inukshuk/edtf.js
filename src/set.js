'use strict'

const List = require('./list')
const { parse } = require('./parser')

class Set extends List {
  static parse(input) {
    return parse(input, { types: ['Set'] })
  }

  get type() {
    return 'Set'
  }

  toEDTF() {
    return this.empty ? '[]' : [
      this.earlier ? '[..' : '[', this.content(), this.later ? '..]' : ']'
    ].join('')
  }
}

module.exports = Set
