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

  it('static equality', () => {
    expect(X.is(true, true)).to.be.ok
    expect(X.is(true, 'day')).to.be.ok
    expect(X.is(true, 'month')).to.be.ok
    expect(X.is(true, 'year')).to.be.ok

    expect(X.is('day', 'day')).to.be.ok
    expect(X.is('month', 'month')).to.be.ok
    expect(X.is('year', 'year')).to.be.ok

    expect(X.is('day', 'month')).to.be.zero
    expect(X.is('day', 'year')).to.be.zero
    expect(X.is('month', 'year')).to.be.zero
    expect(X.is('month', 'day')).to.be.zero
    expect(X.is('year', 'day')).to.be.zero
    expect(X.is('year', 'month')).to.be.zero

    expect(X.is(false, false)).to.be.zero
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
