'use strict'

const ExtDate = require('./src/date')
const Bitmask = require('./src/bitmask')


function edtf(...args) {
  return new ExtDate(...args)
}


module.exports = Object.assign(edtf, {
  Date: ExtDate,
  Bitmask
})
