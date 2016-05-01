'use strict'

class ExtDate extends Date {
  constructor(...args) {

    if (args.length === 1 && typeof args[0] === 'object') {
      // TODO
    }

    super(...args)
  }
}

module.exports = ExtDate
