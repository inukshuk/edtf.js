'use strict'

const { List } = require('..')

describe('List', () => {

  describe('.edtf', () => {
    it('default', () =>
      expect(new List().edtf).to.eql('{}'))

    it('{YYYY}', () => {
      expect(new List(['2016']).edtf).to.eql('{2016}')
    })

    it('{..YYYY}', () => {
      expect(new List({ values: ['2016'], earlier: true }).edtf)
        .to.eql('{..2016}')
      expect(new List({ values: [], earlier: true }).edtf)
        .to.eql('{}')
    })

    it('{YYYY..}', () => {
      expect(new List({ values: ['2016'], later: true }).edtf)
        .to.eql('{2016..}')
      expect(new List({ values: [], later: true }).edtf)
        .to.eql('{}')
    })

    it('{YYYY..YYYY}', () => {
      expect(new List([['2016', '2018']]).edtf).to.eql('{2016..2018}')
    })
  })
})

