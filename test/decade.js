'use strict'

const { Decade } = require('..')

describe('Decade', () => {

  describe('.edtf', () => {
    it('default', () =>
      expect(new Decade().edtf).to.match(/^\d\d\d$/))

    it('DDD', () => {
      expect(new Decade([198]).edtf).to.eql('198')
      expect(new Decade(99).edtf).to.eql('099')
    })

    it('-DDD', () => {
      expect(new Decade(-9).edtf).to.eql('-009')
    })

    it('DDD~', () => {
      expect(new Decade({ values: [198], approximate: true }).edtf)
        .to.eql('198~')
    })
  })
})

