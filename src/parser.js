'use strict'

const nearley = require('nearley')
const grammar = require('./grammar')

module.exports = {

  parse(input) {
    let nep = module.exports.parser()
    let res = nep.feed(input).results[0]

    if (!res) throw new Error('edtf: No possible parsings (@EOS)')

    return res
  },

  parser() {
    return new nearley.Parser(grammar.ParserRules, grammar.ParserStart)
  }
}
