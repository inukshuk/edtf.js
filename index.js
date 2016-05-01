'use strict'

const ExtDate = require('./src/date')

function edtf(...args) {
  return new ExtDate(...args)
}


module.exports = edtf
module.exports.Date = ExtDate
