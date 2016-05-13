'use strict'

const ExtDate = require('./src/date')
const Year = require('./src/year')
const Decade = require('./src/decade')
const Century = require('./src/century')
const Season = require('./src/season')
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
  Year,
  Decade,
  Century,
  Season,
  Bitmask,
  parse,
  sample,
  gen,
  types
})
