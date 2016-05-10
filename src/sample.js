  /*
   * Based on `nearley-unparse`
   * https://github.com/Hardmath123/nearley/blob/master/bin/nearley-unparse.js
   *
   * Copyright (c) 2014 Hardmath123
   */
'use strict'

const assert = require('assert')
const randexp = require('randexp')
const { ParserRules: Rules } = require('./grammar')
const types = require('./types')

const NAMES = [
  { any: 'L0' },
  { any: 'L1' },
  { any: 'L2' }
]

module.exports = {

  *sample({ count = Infinity, level, type }) {
    let name = 'edtf'

    assert(count > 0)

    if (typeof level !== 'undefined') {
      assert([0, 1, 2].includes(level))

      if (typeof type !== 'undefined')
        assert(types.include(type))

      name = NAMES[level][type || 'any']
    }

    for (var i = 0; i < count; ++i) yield module.exports.gen(name)
  },

  gen(root = 'edtf') {
    let output = []
    let stack = [root]

    while (stack.length > 0) {
      let name = stack.pop()

      if (typeof name === 'string') {
        let rules = Rules.filter(r => r.name === name)

        if (rules.length > 0) {
          let sample = rules[
            Math.floor(Math.random() * rules.length)
          ]

          for (let j = sample.symbols.length - 1; j >= 0; --j)
            stack.push(sample.symbols[j])

        } else throw new Error(`No match for rule "${name}"!`)

        continue
      }

      if (name.test) {
        output.push(new randexp(name).gen())
        continue
      }

      if (name.literal) {
        output.push(name.literal)
        continue
      }
    }

    return output.join('')
  }
}
