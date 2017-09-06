'use strict'

const edtf = require('..')
const canFormatToParts =
  typeof Intl.DateTimeFormat.prototype.formatToParts === 'function'

describe('format', () => {
  const { format } = edtf

  it('is a function', () =>
    expect(format).to.be.a('function'))

  it('formats normal dates', () => {
    expect(format(new Date(2017, 4, 9), 'en-US')).to.eql('5/9/2017')
  })

  it('formats extended dates based on precision', () => {
    expect(format(edtf('2017'))).to.eql('2017')
    expect(format(edtf('2017-09'))).to.eql('9/2017')
    expect(format(edtf('2017-09-06'))).to.eql('9/6/2017')
  })

  it('accepts standard options', () => {
    expect(format(edtf('2017-09-06'), 'en-US', {
      month: 'short',
      weekday: 'short'
    })).to.eql('Wed, Sep 6, 2017')
  })

  it('formats uncertain/approximate dates', () => {
    expect(format(edtf('2017?'))).to.eql('2017 (?)')
    expect(format(edtf('2017~'))).to.eql('c. 2017')
  })

  it('formats unspecified parts', canFormatToParts ? () => {
    expect(format(edtf('2017-09-XX'), 'en-US', {
      month: 'short'
    })).to.eql('Sep X, 2017')

    expect(format(edtf('2017-XX-06'), 'en-US', {
      month: 'short'
    })).to.eql('XXX 6, 2017')

    expect(format(edtf('XXXX-09-06'), 'en-US', {
      month: 'short',
      year: '2-digit'
    })).to.eql('Sep 6, XX')

  } : null)
})
