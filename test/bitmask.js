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

})
