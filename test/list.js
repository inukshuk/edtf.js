'use strict'

const { List } = require('..')

describe('List', () => {

  describe('.edtf', () => {
    it('default', () =>
      expect(new List().edtf).to.eql('{}'))

    it('{YYYY}', () => {
      expect(new List(['2016']).edtf).to.eql('{2016}')
    })

    it('{YYYY..YYYY}', () => {
      expect(new List([['2016', '2018']]).edtf).to.eql('{2016..2018}')
    })
  })
})
