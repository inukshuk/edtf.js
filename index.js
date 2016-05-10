'use strict'

const ExtDate = require('./src/date')
const Bitmask = require('./src/bitmask')

const { parse } = require('./src/parser')

const types = [
  'Date', 'Year', 'Season', 'Interval', 'Set', 'List', 'Century', 'Decade'
]

function edtf(...args) {
  if (!args.length) return new ExtDate()

  const res = parse(...args)
  return new edtf[res.type](res)
}


module.exports = Object.assign(edtf, {
  Date: ExtDate,
  Bitmask,
  parse,
  types
})
