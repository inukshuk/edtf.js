'use strict'

const { Year } = require('..')

describe('Year', () => {

  describe('.edtf', () => {
    it('default', () =>
      expect(new Year().edtf).to.match(/^\d\d\d\d$/))

    it('YYYY', () => {
      expect(new Year(2015).edtf).to.eql('2015')
      expect(new Year(-1).edtf).to.eql('-0001')
    })

    it('YYYYYY', () => {
      expect(new Year(12015).edtf).to.eql('Y12015')
      expect(new Year(-10001).edtf).to.eql('Y-10001')
    })

    it('YYYYS2', () => {
      expect(new Year({ values: [2015], significant: 2 }).edtf)
        .to.eql('2015S2')
      expect(new Year({ values: [-24], significant: 2 }).edtf)
        .to.eql('-0024S2')
    })

    it('YYYYYYSD', () => {
      expect(new Year({ values: [12345], significant: 1 }).edtf)
        .to.eql('Y12345S1')
    })
  })
})

