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

  wrap(content) {
    return `[${content}]`
  }
}

module.exports = Set
