'use strict'

const types = require('./types')
const { parse } = require('./parser')

const UNIX_TIME = /^\d{5,}$/

function edtf(...args) {
  if (!args.length)
    return new types.Date()

  if (args.length === 1) {
    switch (typeof args[0]) {
    case 'object':
      return new (types[args[0].type] || types.Date)(args[0])
    case 'number':
      return new types.Date(args[0])
    case 'string':
      if ((UNIX_TIME).test(args[0]))
        return new types.Date(Number(args[0]))
    }
  }

  let res = parse(...args)
  return new types[res.type](res)
}

module.exports = edtf
