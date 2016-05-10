'use strict'

const ExtDate = require('./src/date')
const Bitmask = require('./src/bitmask')

const { parse } = require('./src/parser')

const types = [
  'Date', 'Year', 'Season', 'Interval', 'Set', 'List'
]

function edtf(...args) {
  const res = parse(...args)
  return new ExtDate(res)
  //return new this[res.type](res)
}


module.exports = Object.assign(edtf, {
  Date: ExtDate,
  Bitmask,
  parse,
  types
})
