'use strict'

const edtf = require('..')

describe('format', () => {
  const { format } = edtf

  it('is a function', () =>
    expect(format).to.be.a('function'))


  it('formats normal dates', () => {
    expect(format(new Date(2017, 4, 9), 'en-US')).to.eql('5/9/2017')
  })
})
