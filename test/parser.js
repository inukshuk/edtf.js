'use strict'

const parser = require('../src/parser')
const { Parser } = require('nearley')

describe('parser', () => {
  function p(input) { return parser().feed(input).results[0] }

  it('returns a parser instance', () =>
    expect(parser()).to.be.instanceof(Parser))

  describe('recognizes', () => {
    it('YYYY', () => expect(p('2016')).to.yield([2016]))
    it('0YYY', () => expect(p('0409')).to.yield([409]))
    it('00YY', () => expect(p('0023')).to.yield([23]))
    it('000Y', () => expect(p('0007')).to.yield([7]))
    it('0000', () => expect(p('0000')).to.yield([0]))

    it('YYYY-MM', () => {
      expect(p('2016-05')).to.yield([2016, 5])
      expect(p('2016-01')).to.yield([2016, 1])
      expect(p('2016-12')).to.yield([2016, 12])

      expect(() => p('2016-13')).to.throw('No possible parsings')
      expect(() => p('2016-00')).to.throw('No possible parsings')
    })

    it('YYYY-MM-DD', () => {
      expect(p('2016-05-01')).to.yield([2016, 5, 1])
      expect(p('2016-05-13')).to.yield([2016, 5, 13])
      expect(p('2016-05-29')).to.yield([2016, 5, 29])
      expect(p('2016-05-30')).to.yield([2016, 5, 30])
      expect(p('2016-05-31')).to.yield([2016, 5, 31])

      expect(() => p('2016-05-00')).to.throw('No possible parsings')
      expect(() => p('2016-05-32')).to.throw('No possible parsings')
    })
  })
})

