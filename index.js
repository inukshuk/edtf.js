'use strict'

const ExtDate = require('./src/date')
const Bitmask = require('./src/bitmask')
const types = require('./src/types')

const { sample, gen } = require('./src/sample')
const { parse } = require('./src/parser')


function edtf(...args) {
  if (!args.length) return new ExtDate()

  const res = parse(...args)
  return new edtf[res.type](res)
}


module.exports = Object.assign(edtf, {
  Date: ExtDate,
  Bitmask,
  parse,
  sample,
  gen,
  types
})
