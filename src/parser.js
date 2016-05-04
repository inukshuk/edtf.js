'use strict'

const nearley = require('nearley')
const grammar = require('./grammar')

function byLevel(a, b) {
  return a.level < b.level ? -1 : a.level > b.level ? 1 : 0
}

function best(results) {
  if (!results || !results.length) return undefined
  if (results.length === 1) return results[0]

  // If there are multiple results, pick the first
  // one on the lowest level!
  return results.sort(byLevel)[0]
}

module.exports = {

  parse(input) {
    let nep = module.exports.parser()
    let res = best(nep.feed(input).results)

    if (!res) throw new Error('edtf: No possible parsings (@EOS)')

    return res
  },

  parser() {
    return new nearley.Parser(grammar.ParserRules, grammar.ParserStart)
  }
}
