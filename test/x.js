'use strict'

const { X } = require('..')

describe('x', () => {
  let x = new X()
  beforeEach(() => x.reset())

  it('false by default', () => {
    expect(x.is()).to.be.zero
    expect(x.is('day')).to.be.zero
    expect(x.is('month')).to.be.zero
    expect(x.is('year')).to.be.zero
  })

  it('day', () => {
    x.set(X.day)
    expect(x.is('day')).to.be.ok
    expect(x.is('month')).to.be.zero
    expect(x.is('year')).to.be.zero
  })

  it('month', () => {
    x.set(X.month)
    expect(x.is('day')).to.be.zero
    expect(x.is('month')).to.be.ok
    expect(x.is('year')).to.be.zero
  })

  it('year', () => {
    x.set(X.year)
    expect(x.is('day')).to.be.zero
    expect(x.is('month')).to.be.zero
    expect(x.is('year')).to.be.ok
    expect(x.is('XXXXMMDD')).to.be.ok
    expect(x.is('YYXXMMDD')).to.be.ok
    expect(x.is('YYXXMMDD')).to.be.ok
  })
})
