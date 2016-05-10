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
  {
    any: 'L0', Date: 'date_time', Century: 'century', Interval: 'L0i'
  },
  {
    any: 'L1', Date: 'L1d', Year: 'L1Y', Season: 'L1S', Interval: 'L1i'
  },
  {
    any: 'L2', Date: 'L2s', Year: 'L2Y', Season: 'L2S', Interval: 'L2i',
    Decade: 'L2D', Set: 'set', List: 'list'
  }
]

module.exports = {

  *sample({ count = Infinity, level, type }) {
    let name = 'edtf'

    assert(count > 0)

    if (typeof level !== 'undefined') {
      assert([0, 1, 2].includes(level), `invalid level ${level}`)

      if (typeof type !== 'undefined')
        assert(types.includes(type), `invalid type ${type}`)

      name = NAMES[level][type || 'any']

      if (!name)
        throw new Error(`impossible to generate ${type} at level ${level}`)
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
