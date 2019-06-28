'use strict'

const { Decade } = require('..')

describe('Decade', () => {
  describe('getters', () => {
    it('certain', () => {
      expect(new Decade({ values: [201], uncertain: true }).uncertain)
        .to.eql(true)
      expect(new Decade({ values: [201] }).uncertain).to.eql(false)
    })
  })

  describe('bounds', () => {
    it('min', () => {
      expect(new Decade(199).min)
        .to.eql(Date.UTC(1990, 0, 1, 0, 0, 0, 0))
    })

    it('max', () => {
      expect(new Decade(199).max)
        .to.eql(Date.UTC(1999, 11, 31, 23, 59, 59, 999))
    })
  })

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

    it('DDD?', () => {
      expect(new Decade({ values: [198], uncertain: true }).edtf)
        .to.eql('198?')
    })
  })
})

