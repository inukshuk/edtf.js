'use strict'

const { Century } = require('..')

describe('Century', () => {

  describe('.edtf', () => {
    it('default', () =>
      expect(new Century().edtf).to.match(/^\d\d$/))

    it('CC', () => {
      expect(new Century([20]).edtf).to.eql('20')
      expect(new Century(1).edtf).to.eql('01')
    })

    it('-CC', () => {
      expect(new Century(-9).edtf).to.eql('-09')
      expect(new Century(-19).edtf).to.eql('-19')
    })

    it('CC~', () => {
      expect(new Century({ values: [19], approximate: true }).edtf)
        .to.eql('19~')
    })
  })

  describe('bounds', () => {
    it('min', () => {
      expect(new Century(20).min)
        .to.eql(Date.UTC(2000, 0, 1, 0, 0, 0, 0))
    })

    it('max', () => {
      expect(new Century(20).max)
        .to.eql(Date.UTC(2099, 11, 31, 23, 59, 59, 999))
    })
  })
})
