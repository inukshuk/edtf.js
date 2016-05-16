'use strict'

const edtf = require('..')

describe('edtf', () => {

  it('is a function', () =>
    expect(edtf).to.be.a('function'))

  it('returns dates by default', () =>
    expect(edtf()).to.be.a.date.and.an.edtf)

  it('parses strings', () => {
    expect(edtf('2016-03')).to.be.an.edtf.and.produce([2016, 2])
  })

  it('creates new extended date objects', () => {
    expect(edtf([2016, 2])).to.be.an.edtf.and.produce([2016, 2])

    let a = new edtf.Date([2016])

    expect(edtf(a))
      .to.be.an.edtf
      .and.produce([2016])
      .and.not.equal(a)
  })
})
