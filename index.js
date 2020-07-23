'use strict'

const edtf = require('./src/edtf')
const Bitmask = require('./src/bitmask')
const types = require('./src/types')
const { parse, defaults } = require('./src/parser')
const { format } = require('./src/format')

module.exports = Object.assign(edtf, types, {
  Bitmask,
  defaults,
  parse,
  format,
  get sample() {
    return require('./src/sample').sample
  },
  types: Object.keys(types)
})
