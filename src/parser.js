'use strict'

const nearley = require('nearley')
const grammar = require('./grammar')

function byLevel(a, b) {
  return a.level < b.level ? -1 : a.level > b.level ? 1 : 0
}

function limit(results, level, types) {
  if (!results || !results.length) return undefined

  return results.filter(res =>
    (res.level <= level) && (!types || types.includes(res.type)))
}

function best(results) {
  if (!results || !results.length) return undefined
  if (results.length === 1) return results[0]

  // If there are multiple results, pick the first
  // one on the lowest level!
  return results.sort(byLevel)[0]
}

module.exports = {

  parse(input, constraints) {
    let nep = module.exports.parser()
    let res = nep.feed(input).results

    if (constraints) {
      res = limit(res, constraints.level || 0, constraints.types)
    }

    res = best(res)

    if (!res) throw new Error('edtf: No possible parsings (@EOS)')

    return res
  },

  parser() {
    return new nearley.Parser(grammar.ParserRules, grammar.ParserStart)
  }
}
