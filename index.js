'use strict'

const ExtDate = require('./src/date')
const X = require('./src/x')

function edtf(...args) {
  return new ExtDate(...args)
}


module.exports = edtf
module.exports.Date = ExtDate
module.exports.X = X
