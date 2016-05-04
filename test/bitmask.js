'use strict'

const { Bitmask } = require('..')

describe('Bitmask', () => {

  describe('instance', () => {
    let bm
    beforeEach(() => bm = new Bitmask())

    it('is zero by default', () => {
      expect(bm.value).to.be.zero
      expect(bm.test()).to.be.zero
      expect(bm.test('day')).to.be.zero
      expect(bm.test('month')).to.be.zero
      expect(bm.test('year')).to.be.zero
    })

    describe('.mask()', () => {
      it('YYYYMMXX', () =>
        expect(bm.set('day').mask().join('')).to.eql('YYYYMMXX'))

      it('YYYYXXDD', () =>
        expect(bm.set('month').mask().join('')).to.eql('YYYYXXDD'))

      it('XXXXMMDD', () =>
        expect(bm.set('year').mask().join('')).to.eql('XXXXMMDD'))
    })

    describe('.toString()', () => {
      it('YYYY-MM-DD', () =>
        expect(bm.toString()).to.eql('YYYY-MM-DD'))

      it('YYYY-MM-XX', () =>
        expect(bm.set('day').toString()).to.eql('YYYY-MM-XX'))
    })
  })

  describe('.test()', () => {
    it('true', () => {
      expect(Bitmask.test(true, true)).to.be.ok
      expect(Bitmask.test(true, 'day')).to.be.ok
      expect(Bitmask.test(true, 'month')).to.be.ok
      expect(Bitmask.test(true, 'year')).to.be.ok
      expect(Bitmask.test(true, false)).to.be.zero
    })

    it('day', () => {
      expect(Bitmask.test('day', 'day')).to.be.ok
      expect(Bitmask.test('day', 'month')).to.be.zero
      expect(Bitmask.test('day', 'year')).to.be.zero
      expect(Bitmask.test('day', true)).to.be.ok
    })

    it('month', () => {
      expect(Bitmask.test('month', 'month')).to.be.ok
      expect(Bitmask.test('month', 'year')).to.be.zero
      expect(Bitmask.test('month', 'day')).to.be.zero
      expect(Bitmask.test('month', true)).to.be.ok
      expect(Bitmask.test('month', Bitmask.Y)).to.be.zero
      expect(Bitmask.test('month', Bitmask.YM)).to.be.ok
      expect(Bitmask.test('month', Bitmask.YMD)).to.be.ok
    })

    it('year', () => {
      expect(Bitmask.test('year', 'year')).to.be.ok
      expect(Bitmask.test('year', 'day')).to.be.zero
      expect(Bitmask.test('year', 'month')).to.be.zero
      expect(Bitmask.test('year', true)).to.be.ok
      expect(Bitmask.test('year', Bitmask.Y)).to.be.ok
      expect(Bitmask.test('year', Bitmask.YM)).to.be.ok
      expect(Bitmask.test('year', Bitmask.YMD)).to.be.ok
      expect(Bitmask.test('year', Bitmask.YYXX)).to.be.ok
      expect(Bitmask.test('year', Bitmask.YYYX)).to.be.ok
      expect(Bitmask.test('year', Bitmask.XXXX)).to.be.ok
    })

    it('false', () => {
      expect(Bitmask.test(false, false)).to.be.zero
      expect(Bitmask.test(false, 'day')).to.be.zero
      expect(Bitmask.test(false, 'month')).to.be.zero
      expect(Bitmask.test(false, 'year')).to.be.zero
      expect(Bitmask.test(false, true)).to.be.zero
    })
  })

  describe('.values()', () => {
    it('XXXXXXXX', () => {
      expect(Bitmask.values('XXXXXXXX')).to.eql([0, 0, 1])
      expect(Bitmask.values('XXXXXXXX', 9)).to.eql([9999, 11, 31])
    })

    it('XXXXXXDD', () => {
      expect(Bitmask.values('XXXXXX31')).to.eql([0, 0, 31])
      expect(Bitmask.values('XXXXXX31', 9)).to.eql([9999, 11, 31])
    })

    it('XXXXMMXX', () => {
      expect(Bitmask.values('XXXX05XX')).to.eql([0, 4, 1])
      expect(Bitmask.values('XXXX05XX', 9)).to.eql([9999, 4, 31])
      expect(Bitmask.values('XXXX02XX', 9)).to.eql([9999, 1, 29])
      expect(Bitmask.values('XXXX06XX', 9)).to.eql([9999, 5, 30])
    })

    it('YYYYXXXX', () => {
      expect(Bitmask.values('2014XXXX')).to.eql([2014, 0, 1])
      expect(Bitmask.values('2014XXXX', 9)).to.eql([2014, 11, 31])
    })

    it('XXXXXXDX', () => {
      expect(Bitmask.values('XXXXXX3X')).to.eql([0, 0, 30])
      expect(Bitmask.values('XXXXXX3X', 9)).to.eql([9999, 11, 31])
      expect(Bitmask.values('XXXXXX2X')).to.eql([0, 0, 20])
      expect(Bitmask.values('XXXXXX2X', 9)).to.eql([9999, 11, 29])
    })

    it('XXXXMXXX', () => {
      expect(Bitmask.values('XXXX0XXX')).to.eql([0, 0, 1])
      expect(Bitmask.values('XXXX0XXX', 9)).to.eql([9999, 8, 30])
      expect(Bitmask.values('XXXX1XXX')).to.eql([0, 9, 1])
      expect(Bitmask.values('XXXX1XXX', 9)).to.eql([9999, 11, 31])
    })

    it('XXXXMX', () => {
      expect(Bitmask.values('XXXX0X')).to.eql([0, 0])
      expect(Bitmask.values('XXXX0X', 9)).to.eql([9999, 8])
      expect(Bitmask.values('XXXX1X')).to.eql([0, 9])
      expect(Bitmask.values('XXXX1X', 9)).to.eql([9999, 11])
    })
  })

})
