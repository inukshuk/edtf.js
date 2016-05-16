'use strict'

const { Set } = require('..')

describe('Set', () => {

  describe('.edtf', () => {
    it('default', () =>
      expect(new Set().edtf).to.eql('[]'))

    it('[YYYY]', () => {
      expect(new Set(['2016']).edtf).to.eql('[2016]')
    })

    it('[..YYYY]', () => {
      expect(new Set({ values: ['2016'], earlier: true }).edtf)
        .to.eql('[..2016]')
      expect(new Set({ values: [], earlier: true }).edtf)
        .to.eql('[]')
    })

    it('[YYYY..]', () => {
      expect(new Set({ values: ['2016'], later: true }).edtf)
        .to.eql('[2016..]')
      expect(new Set({ values: [], later: true }).edtf)
        .to.eql('[]')
    })

    it('[YYYY..YYYY]', () => {
      expect(new Set([['2016', '2018']]).edtf).to.eql('[2016..2018]')
    })
  })
})

