'use strict'

const ExtDate = require('./src/date')
const Year = require('./src/year')
const Decade = require('./src/decade')
const Century = require('./src/century')
const Season = require('./src/season')
const Interval = require('./src/interval')
const List = require('./src/list')
const Set = require('./src/set')
const Bitmask = require('./src/bitmask')
const types = require('./src/types')

const { sample, gen } = require('./src/sample')
const { parse } = require('./src/parser')


function edtf(...args) {
  if (!args.length)
    return new ExtDate()

  if (args.length === 1 && typeof args[0] === 'object' && args[0].type)
    return new edtf[args[0].type](args[0])

  const res = parse(...args)
  return new edtf[res.type](res)
}


module.exports = Object.assign(edtf, {
  Date: ExtDate,
  Year,
  Decade,
  Century,
  Season,
  Interval,
  List,
  Set,
  Bitmask,
  parse,
  sample,
  gen,
  types
})
