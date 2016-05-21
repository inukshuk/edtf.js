'use strict'

const { Interval } = require('..')

describe('Interval', () => {

  describe('bounds', () => {
    it('min', () => {
      expect(new Interval([2001], [2003]).min)
        .to.eql(Date.UTC(2001, 0, 1, 0, 0, 0, 0))
    })

    it('max', () => {
      expect(new Interval([2001], [2003]).max)
        .to.eql(Date.UTC(2003, 11, 31, 23, 59, 59, 999))
    })
  })

  describe('.edtf', () => {
    it('default', () =>
      expect(new Interval().edtf).to.eql('/'))
  })
})
