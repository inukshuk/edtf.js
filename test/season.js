'use strict'

const { Season } = require('..')

describe('Season', () => {

  describe('bounds', () => {
    it('min', () => {
      expect(new Season(2016, 33).min)
        .to.eql(Date.UTC(2016, 0, 1, 0, 0, 0, 0))
      expect(new Season(2016, 34).min)
        .to.eql(Date.UTC(2016, 3, 1, 0, 0, 0, 0))
    })

    it('max', () => {
      expect(new Season(2016, 33).max)
        .to.eql(Date.UTC(2016, 2, 31, 23, 59, 59, 999))
      expect(new Season(2016, 34).max)
        .to.eql(Date.UTC(2016, 5, 30, 23, 59, 59, 999))
    })
  })

  describe('.edtf', () => {
    it('default', () =>
      expect(new Season().edtf).to.match(/^\d\d\d\d-21$/))

    it('YYYY-SS', () => {
      expect(new Season([2014, 23]).edtf).to.eql('2014-23')
      expect(new Season(14).edtf).to.eql('0014-21')
    })
  })
})
