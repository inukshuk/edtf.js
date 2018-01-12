'use strict'

const { Interval, Date, Season } = require('..')

describe('Interval', () => {

  it('.type', () => {
    expect(Interval.type).to.eql('Interval')
    expect(new Interval().type).to.eql('Interval')
  })

  it('.from()', () => {
    expect(Interval.from('2016/2017')).to.be.instanceof(Interval)
  })

  describe('bounds', () => {
    it('min', () => {
      expect(new Interval([2001], [2003]).min)
        .to.eql(Date.UTC(2001, 0, 1, 0, 0, 0, 0))
    })

    it('max', () => {
      expect(new Interval([2001], [2003]).max)
        .to.eql(Date.UTC(2003, 11, 31, 23, 59, 59, 999))
    })
  })

  describe('invalid', () => {
    it('bounds', () => {
      expect(() => new Interval([2001], [2000])).to.throw(RangeError)
    })
  })

  describe('iteration', () => {
    const Q1_94 = new Interval([1994, 0], [1994, 2])
    const FEB_94 = new Date(1994, 1)
    const FEB1_94 = new Date(1994, 1, 1)
    const YEAR_94 = new Date([1994])

    it('@@iterator', () => {
      expect([...new Interval([2001], [2003])].map(v => v.edtf))
        .to.eql(['2001', '2002', '2003'])

      expect([...Q1_94].map(v => v.edtf))
        .to.eql(['1994-01', '1994-02', '1994-03'])
    })

    it('covers', () => {
      expect(Q1_94.covers(FEB_94)).to.be.true
      expect(Q1_94.covers(FEB1_94)).to.be.true
      expect(Q1_94.covers(YEAR_94)).not.to.be.true
    })

    it('includes', () => {
      expect(Q1_94.includes(FEB_94)).to.be.true
      expect(Q1_94.includes(FEB1_94)).not.to.be.true
      expect(Q1_94.includes(YEAR_94)).not.to.be.true
    })
  })

  describe('.edtf', () => {
    it('default', () =>
      expect(new Interval().edtf).to.eql('/'))
  })

  describe('seasons (non-standard)', () => {
    const S80 = new Interval('1980-21', '1980-24')

    it('.lower', () => {
      expect(S80.lower).to.be.instanceof(Season)
    })

    it('.edtf', () => {
      expect(S80.toEDTF()).to.be.eql('1980-21/1980-24')
    })

    it('.covers', () => {
      expect(S80.covers(new Season(1980, 22))).to.be.true
      expect(S80.covers(new Date(1980, 8))).to.be.true
    })

    it('.includes', () => {
      expect(S80.includes(new Season(1980, 22))).to.be.true
      expect(S80.includes(new Date(1980, 8))).to.be.false
    })
  })
})
