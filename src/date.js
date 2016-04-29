'use strict'

class ExtDate extends Date {
  constructor(input) {
    if (arguments.length !== 1) return super(...arguments)
    if (typeof input !== 'string') return super(input)

    super(input)
  }
}

module.exports = ExtDate
