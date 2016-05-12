'use strict'

const { Season } = require('..')

describe('Season', () => {

  describe('.edtf', () => {
    it('default', () =>
      expect(new Season().edtf).to.match(/^\d\d\d\d-21$/))

    it('YYYY-SS', () => {
      expect(new Season([2014, 23]).edtf).to.eql('2014-23')
      expect(new Season(14).edtf).to.eql('0014-21')
    })
  })
})
