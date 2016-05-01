'use strict'

const parser = require('../src/parser')
const { Parser } = require('nearley')

describe('parser', () => {
  function p(input) { return parser().feed(input).results[0] }

  it('returns a parser instance', () =>
    expect(parser()).to.be.instanceof(Parser))

  describe('recognizes', () => {
    it('YYYY', () => expect(p('2016')).to.produce([2016]))
    it('0YYY', () => expect(p('0409')).to.produce([409]))
    it('00YY', () => expect(p('0023')).to.produce([23]))
    it('000Y', () => expect(p('0007')).to.produce([7]))
    it('0000', () => expect(p('0000')).to.produce([0]))

    it('YYYY-MM', () => {
      expect(p('2016-05')).to.produce([2016, 5])
      expect(p('2016-01')).to.produce([2016, 1])
      expect(p('2016-12')).to.produce([2016, 12])

      expect(() => p('2016-13')).to.be.rejected
      expect(() => p('2016-00')).to.be.rejected
    })

    it('YYYY-MM-DD', () => {
      expect(p('2016-05-01')).to.produce([2016, 5, 1])
      expect(p('2016-05-13')).to.produce([2016, 5, 13])
      expect(p('2016-05-29')).to.produce([2016, 5, 29])
      expect(p('2016-05-30')).to.produce([2016, 5, 30])
      expect(p('2016-05-31')).to.produce([2016, 5, 31])

      expect(() => p('2016-05-00')).to.be.rejected
      expect(() => p('2016-05-32')).to.be.rejected
    })
  })
})

