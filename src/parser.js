'use strict'

const nearley = require('nearley')
const grammar = require('./grammar')

module.exports = function parser() {
  return new nearley.Parser(grammar.ParserRules, grammar.ParserStart)
}
