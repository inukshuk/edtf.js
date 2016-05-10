'use strict'

const nearley = require('nearley')
const grammar = require('./grammar')

function byLevel(a, b) {
  return a.level < b.level ? -1 : a.level > b.level ? 1 : 0
}

function limit(results, { level, types }) {
  if (!results.length) return results
  if (typeof level !== 'number') level = 2

  return results.filter(res =>
    (level >= res.level) && (!types || types.includes(res.type)))
}

function best(results) {
  if (results.length < 2) return results[0]

  // If there are multiple results, pick the first
  // one on the lowest level!
  return results.sort(byLevel)[0]
}

module.exports = {

  parse(input, constraints = {}) {
    let nep = module.exports.parser()
    let res = best(limit(nep.feed(input).results, constraints))

    if (!res) throw new Error('edtf: No possible parsings (@EOS)')

    return res
  },

  parser() {
    return new nearley.Parser(grammar.ParserRules, grammar.ParserStart)
  }
}
