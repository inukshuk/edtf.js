import { Season } from '../index.js'

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

  describe('.next', () => {
    it('positive', () => {
      expect(new Season(2018, 21).next().toEDTF()).to.eql('2018-22')
      expect(new Season(2018, 21).next(2).toEDTF()).to.eql('2018-23')
      expect(new Season(2018, 21).next(3).toEDTF()).to.eql('2018-24')
      expect(new Season(2018, 21).next(4).toEDTF()).to.eql('2019-21')
      expect(new Season(2018, 25).next(9).toEDTF()).to.eql('2020-26')
    })

    it('negative', () => {
      expect(new Season(2018, 24).next(-1).toEDTF()).to.eql('2018-23')
      expect(new Season(2018, 24).next(-2).toEDTF()).to.eql('2018-22')
      expect(new Season(2018, 24).next(-3).toEDTF()).to.eql('2018-21')
      expect(new Season(2018, 24).next(-4).toEDTF()).to.eql('2017-24')
      expect(new Season(2018, 24).next(-9).toEDTF()).to.eql('2016-23')
    })
  })

  describe('.edtf', () => {
    it('default', () =>
      expect(new Season().edtf).to.match(/^\d\d\d\d-21$/))

    it('YYYY-SS', () => {
      expect(new Season([2014, 23]).edtf).to.eql('2014-23')
      expect(new Season(14).edtf).to.eql('0014-21')
    })

    it('YYYY?-SS', () =>
      expect(new Season({ values: [2014, 22], uncertain: 'year' }).edtf)
        .to.eql('2014?-22'))

    it('YYYX-SS', () =>
      expect(new Season({ values: [2014, 22], unspecified: 'yyyxmmdd' }).edtf)
        .to.eql('201X-22'))
  })
})
