'use strict'

const { Interval } = require('..')

describe('Interval', () => {

  describe('.edtf', () => {
    it('default', () =>
      expect(new Interval().edtf).to.eql('/'))
  })
})
