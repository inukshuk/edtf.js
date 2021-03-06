import { Set } from '../index.js'

describe('Set', () => {

  it('type', () => {
    expect(Set.type).to.eql('Set')
    expect(new Set().type).to.eql('Set')
  })

  it('.from()', () => {
    expect(Set.from('[2016]')).to.be.instanceof(Set)
  })

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

  describe('precision', () => {
    it('supports varying precisions', () => {
      expect(new Set('[1984,1985-10-01]').values.map(d => d.precision))
        .to.eql([1, 3])
      expect(new Set('[1984,1985-10-01..]').values.map(d => d.precision))
        .to.eql([1, 3])
      expect(new Set('[..1984,1985-10-01..]').values.map(d => d.precision))
        .to.eql([1, 3])
    })
  })
})

