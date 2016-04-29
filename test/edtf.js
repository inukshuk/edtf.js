'use strict'

const edtf = require('..')

describe('edtf', () => {

  it('is a function', () =>
    expect(edtf).to.be.a('function'))

  it('returns dates', () => {
    expect(edtf()).to.be.a.date
    expect(edtf()).to.be.an.edtf
  })
})
