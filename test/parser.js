'use strict'

const parser = require('../src/parser')
const { Parser } = require('nearley')

describe('parser', () => {
  function p(input) { return parser().feed(input).results }

  it('returns a parser instance', () =>
    expect(parser()).to.be.instanceof(Parser))

  describe('recognizes', () => {

    it('YYYY', () => expect(p('2016')).to.eql([2016]))
    it('0YYY', () => expect(p('0409')).to.eql([409]))
    it('00YY', () => expect(p('0023')).to.eql([23]))
    it('000Y', () => expect(p('0007')).to.eql([7]))
  })
})

