'use strict'

const { gen, parse: p } = require('..')

describe('sample', () => {

  it('dates', () => {
    expect(p(gen('date'))).to.have.type('Date')
  })
})
