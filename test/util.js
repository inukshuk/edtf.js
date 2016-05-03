'use strict'

const util = require('../src/util')

describe('util', () => {

  describe('pick', () => {
    const pick = util.pick

    it('generates picker for given indices', () => {
      expect(pick(0)([23, 42])).to.eql(23)
      expect(pick(0, 2)([23, 24, 42])).to.eql([23, 42])
    })
  })

  describe('concat', () => {
    const concat = util.concat

    it('flattens the given arrays', () => {
      expect(concat([23, 42])).to.eql([23, 42])
      expect(concat([23, [42, 53]])).to.eql([23, 42, 53])
    })

    it('skips null values', () => {
      expect(concat([23, 42, null, 13, null])).to.eql([23, 42, 13])
      expect(concat([[23, 42], null, 13, null])).to.eql([23, 42, 13])
    })

    it('picks only given indices', () => {
      expect(concat([23, 42], [1])).to.eql([42])
      expect(concat([23, 42, 53], [0, 2])).to.eql([23, 53])
    })
  })
})
