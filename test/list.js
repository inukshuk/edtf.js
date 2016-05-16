'use strict'

const { List } = require('..')

describe('List', () => {

  describe('.edtf', () => {
    it('default', () =>
      expect(new List().edtf).to.eql('{}'))
  })
})

