'use strict'

const { Date } = require('..')

describe('Date', () => {

  describe('.edtf', () => {
    it('default', () =>
      expect(new Date().edtf)
        .to.match(/^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d\d\dZ$/))

    it('YYYY', () => {
      expect(new Date([2014]).edtf).to.eql('2014')
      expect(new Date([123]).edtf).to.eql('0123')
      expect(new Date([14]).edtf).to.eql('0014')
      expect(new Date([0]).edtf).to.eql('0000')
      expect(new Date([-2]).edtf).to.eql('-0002')
      expect(new Date([-42]).edtf).to.eql('-0042')
      expect(new Date([-9999]).edtf).to.eql('-9999')
    })

    it('YYYY-MM', () => {
      expect(new Date([2014, 3]).edtf).to.eql('2014-04')
      expect(new Date([123, 0]).edtf).to.eql('0123-01')
      expect(new Date([14, 8]).edtf).to.eql('0014-09')
      expect(new Date([0, 0]).edtf).to.eql('0000-01')
      expect(new Date([-2, 11]).edtf).to.eql('-0002-12')
    })

    it('YYYY-MM-DD', () => {
      expect(new Date([2014, 3, 15]).edtf).to.eql('2014-04-15')
      expect(new Date([2016, 1, 29]).edtf).to.eql('2016-02-29')
      expect(new Date([2015, 1, 29]).edtf).to.eql('2015-03-01')
    })

  })
})
