'use strict'

const ExtDate = require('./src/date')

function edtf(input) {
  return new ExtDate(input)
}


module.exports = edtf
module.exports.Date = ExtDate
