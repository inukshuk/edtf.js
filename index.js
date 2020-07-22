'use strict'

const edtf = require('./src/edtf')
const Bitmask = require('./src/bitmask')
const types = require('./src/types')
const { sample } = require('./src/sample')
const { parse, defaults } = require('./src/parser')
const { format } = require('./src/format')

module.exports = Object.assign(edtf, types, {
  Bitmask,
  defaults,
  parse,
  sample,
  format,
  types: Object.keys(types)
})
