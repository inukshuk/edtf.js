'use strict'

const Bitmask = require('./src/bitmask')
const types = require('./src/types')

const { sample } = require('./src/sample')
const { parse, defaults } = require('./src/parser')
const { format } = require('./src/format')

const { assign, keys } = Object

const UNIX_TIME = /^\d{5,}$/

function edtf(...args) {
  if (!args.length)
    return new edtf.Date()

  if (args.length === 1) {
    switch (typeof args[0]) {
    case 'object':
      return new (edtf[args[0].type] || edtf.Date)(args[0])
    case 'number':
      return new edtf.Date(args[0])
    case 'string':
      if ((UNIX_TIME).test(args[0]))
        return new edtf.Date(Number(args[0]))
    }
  }

  let res = parse(...args)
  return new edtf[res.type](res)
}


module.exports = assign(edtf, types, {
  Bitmask,
  defaults,
  parse,
  sample,
  format,
  types: keys(types)
})
