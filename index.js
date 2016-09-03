'use strict'

const Bitmask = require('./src/bitmask')
const types = require('./src/types')

const { sample } = require('./src/sample')
const { parse } = require('./src/parser')
const { format } = require('./src/format')

const { assign, keys } = Object

function edtf(...args) {
  if (!args.length)
    return new edtf.Date()

  if (args.length === 1 && typeof args[0] === 'object')
    return new (edtf[args[0].type] || edtf.Date)(args[0])

  const res = parse(...args)
  return new edtf[res.type](res)
}


module.exports = assign(edtf, types, {
  Bitmask,
  parse,
  sample,
  format,
  types: keys(types)
})
