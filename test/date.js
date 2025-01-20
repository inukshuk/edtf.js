import { Date } from '../index.js'

describe('Date', () => {

  it('.type', () => {
    expect(Date.type).to.eql('Date')
    expect(new Date().type).to.eql('Date')
  })

  it('.from()', () => {
    expect(Date.from('2016')).to.be.instanceof(Date)
  })

  describe('constructor()', () => {
    it('Date', () =>
      expect(new Date(new global.Date(2015, 11)))
        .to.be.an.edtf
        .and.have.year(2015))

    it('ExtDate', () => {
      const a = new Date()
      const b = new Date(a)

      expect(b).to.be.an.edtf.and.not.equal(a)
    })
  })

  describe('.precision', () => {
    it('YYYY', () => {
      expect(new Date([1980]).precision).to.eql(1)
    })

    it('YYYY-MM', () => {
      expect(new Date([1980, 1]).precision).to.eql(2)
    })

    it('YYYY-MM-DD', () => {
      expect(new Date([1980, 1, 23]).precision).to.eql(3)
    })

    it('YYYY-MM-DDThh:mm:ss', () => {
      expect(new Date([1980, 1, 12, 10, 15, 30]).precision).to.eql(0)
    })
  })

  describe('.next()', () => {
    it('YYYY', () => {
      expect(new Date([1980]).next().edtf).to.eql('1981')
      expect(new Date([-1]).next().edtf).to.eql('0000')
      expect(new Date([-2019]).next().edtf).to.eql('-2018')
    })

    it('YYYY-MM', () => {
      expect(new Date([1980, 7]).next().edtf).to.eql('1980-09')
      expect(new Date([-1, 11]).next().edtf).to.eql('0000-01')
      expect(new Date([2015, 11]).next().edtf).to.eql('2016-01')
    })

    it('YYYY-MM-DD', () => {
      expect(new Date([1980, 7, 24]).next().edtf).to.eql('1980-08-25')
      expect(new Date([-1, 11, 31]).next().edtf).to.eql('0000-01-01')
      expect(new Date([2016, 1, 28]).next().edtf).to.eql('2016-02-29')
      expect(new Date([2015, 1, 28]).next().edtf).to.eql('2015-03-01')
    })

    it('YYYX', () => {
      let date = new Date({
        values: [2010],
        unspecified: 8
      })

      expect(date.next().edtf).to.eql('202X')
      expect(date.next().next().edtf).to.eql('203X')
      expect(date.next().prev().edtf).to.eql('201X')
    })

    it('-YYYX', () => {
      let date = new Date({
        values: [-2010],
        unspecified: 8
      })

      expect(date.next().edtf).to.eql('-200X')
      expect(date.next().next().edtf).to.eql('-199X')
      expect(date.next().prev().edtf).to.eql('-201X')
    })
  })

  describe('.prev()', () => {
    it('YYYX', () => {
      let date = new Date({
        values: [2010],
        unspecified: 8
      })

      expect(date.prev().edtf).to.eql('200X')
      expect(date.prev().prev().edtf).to.eql('199X')
      expect(date.prev().next().edtf).to.eql('201X')
    })

    it('-YYYX', () => {
      let date = new Date({
        values: [-2010],
        unspecified: 8
      })

      expect(date.prev().edtf).to.eql('-202X')
      expect(date.prev().prev().edtf).to.eql('-203X')
      expect(date.prev().next().edtf).to.eql('-201X')
    })
  })

  describe('comparison operators', () => {
    it('<', () => {
      expect(new Date([1980])).to.be.below(new Date([1980, 7]))
    })

    it('>', () => {
      expect(new Date('198X')).to.be.above(new Date('196X'))
    })
  })

  describe('compare()', () => {
    function compare(a, b) {
      return new Date(a).compare(new Date(b))
    }

    it('no overlap', () => {
      expect(compare([2001], [2002])).to.eql(-1)
      expect(compare([2002], [2001])).to.eql(1)
      expect(compare([2001], [2001])).to.eql(0)
    })
  })

  describe('between()', () => {
    function between(a, b) {
      return [...new Date(a).between(new Date(b))].map(d => d.values)
    }

    it('YYYY', () => {
      expect(between([2001], [2002])).to.eql([])
      expect(between([2001], [2001])).to.eql([])
      expect(between([2002], [2001])).to.eql([])
      expect(between([2003], [2001])).to.eql([[2002]])
    })
  })

  describe('through()', () => {
    function through(a, b) {
      return [...new Date(a).through(new Date(b))].map(d => d.values)
    }

    it('YYYY', () => {
      expect(through([2001], [2002])).to.eql([[2001], [2002]])
      expect(through([2001], [2001])).to.eql([[2001]])
      expect(through([2002], [2001])).to.eql([[2002], [2001]])
      expect(through([2003], [2001])).to.eql([[2003], [2002], [2001]])
    })

    it('YYYY-MM', () => {
      expect(through([2001, 11], [2002, 1]))
        .to.eql([[2001, 11], [2002, 0], [2002, 1]])
    })
  })

  describe('until()', () => {
    function until(a, b) {
      return [...new Date(a).until(new Date(b))].map(d => d.values)
    }

    it('YYYY', () => {
      expect(until([2001], [2002])).to.eql([[2001]])
      expect(until([2001], [2001])).to.eql([[2001]])
      expect(until([2002], [2001])).to.eql([[2002]])
      expect(until([2003], [2001])).to.eql([[2003], [2002]])
    })

    it('YYYY-MM', () => {
      expect(until([2001, 11], [2002, 1]))
        .to.eql([[2001, 11], [2002, 0]])
    })
  })

  describe('max', () => {
    describe('Level 1', () => {
      it('full precision', () => {
        let date = new Date()
        expect(date.max).to.eql(date.min)
      })

      it('YYYY', () => {
        expect(new Date([2016]).max)
          .to.eql(global.Date.UTC(2016, 11, 31, 23, 59, 59, 999))
      })

      it('YYYY-MM', () => {
        expect(new Date([2016, 1]).max)
          .to.eql(global.Date.UTC(2016, 1, 29, 23, 59, 59, 999))
        expect(new Date([2017, 1]).max)
          .to.eql(global.Date.UTC(2017, 1, 28, 23, 59, 59, 999))
        expect(new Date([2016, 7]).max)
          .to.eql(global.Date.UTC(2016, 7, 31, 23, 59, 59, 999))
      })

      it('YYYY-MM-DD', () => {
        expect(new Date([2016, 1, 1]).max)
          .to.eql(global.Date.UTC(2016, 1, 1, 23, 59, 59, 999))
      })

      it('YYYY-MM-XX', () => {
        expect(Date.from('2016-01-XX').max)
          .to.eql(global.Date.UTC(2016, 0, 31, 23, 59, 59, 999))

        expect(Date.from('2016-02-XX').max)
          .to.eql(global.Date.UTC(2016, 1, 29, 23, 59, 59, 999))

        expect(Date.from('2017-02-XX').max)
          .to.eql(global.Date.UTC(2017, 1, 28, 23, 59, 59, 999))

        expect(Date.from('2016-09-XX').max)
          .to.eql(global.Date.UTC(2016, 8, 30, 23, 59, 59, 999))
      })

      it('YYYY-XX', () => {
        expect(Date.from('2016-XX').values).to.eql([2016, 0])
        expect(Date.from('2016-XX').max)
          .to.eql(global.Date.UTC(2016, 11, 31, 23, 59, 59, 999))
      })

      it('-YYYY-XX', () => {
        expect(Date.from('-2016-XX').values).to.eql([-2016, 0])
      })

      it('YYXX', () => {
        expect(Date.from('20XX').values).to.eql([2000])
        expect(Date.from('20XX').max)
          .to.eql(global.Date.UTC(2099, 11, 31, 23, 59, 59, 999))
      })

      it('-YYXX', () => {
        expect(Date.from('-20XX').values).to.eql([-2000])
      })

      it('YYYX', () => {
        expect(Date.from('201X').max)
          .to.eql(global.Date.UTC(2019, 11, 31, 23, 59, 59, 999))
      })

      it('-YYYX', () => {
        expect(Date.from('-201X').values).to.eql([-2010])
      })


      it('XXXX', () => {
        expect(Date.from('XXXX').max)
          .to.eql(global.Date.UTC(9999, 11, 31, 23, 59, 59, 999))
      })

      it('XXXX-XX', () => {
        expect(Date.from('XXXX-XX').max)
          .to.eql(global.Date.UTC(9999, 11, 31, 23, 59, 59, 999))
      })

      it('XXXX-XX-XX', () => {
        expect(Date.from('XXXX-XX-XX').max)
          .to.eql(global.Date.UTC(9999, 11, 31, 23, 59, 59, 999))
      })
    })

    describe('Level 2', () => {
      it('YYXX-MM-XX', () => {
        expect(Date.from('20XX-01-XX').max)
          .to.eql(global.Date.UTC(2099, 0, 31, 23, 59, 59, 999))
      })

      it('YYYY-MM-DX', () => {
        expect(Date.from('2016-01-0X').max)
          .to.eql(global.Date.UTC(2016, 0, 9, 23, 59, 59, 999))
        expect(Date.from('2016-01-1X').max)
          .to.eql(global.Date.UTC(2016, 0, 19, 23, 59, 59, 999))
        expect(Date.from('2016-01-2X').max)
          .to.eql(global.Date.UTC(2016, 0, 29, 23, 59, 59, 999))
        expect(Date.from('2016-01-3X').max)
          .to.eql(global.Date.UTC(2016, 0, 31, 23, 59, 59, 999))

        expect(Date.from('2016-02-2X').max)
          .to.eql(global.Date.UTC(2016, 1, 29, 23, 59, 59, 999))
        expect(Date.from('2017-02-2X').max)
          .to.eql(global.Date.UTC(2017, 1, 28, 23, 59, 59, 999))

        expect(Date.from('2016-09-2X').max)
          .to.eql(global.Date.UTC(2016, 8, 29, 23, 59, 59, 999))
      })

      it('YYYY-MM-XD', () => {
        expect(Date.from('2016-01-X1').max)
          .to.eql(global.Date.UTC(2016, 0, 31, 23, 59, 59, 999))
        expect(Date.from('2016-01-X2').max)
          .to.eql(global.Date.UTC(2016, 0, 22, 23, 59, 59, 999))

        expect(Date.from('2016-02-X9').max)
          .to.eql(global.Date.UTC(2016, 1, 29, 23, 59, 59, 999))
        expect(Date.from('2016-02-X1').max)
          .to.eql(global.Date.UTC(2016, 1, 21, 23, 59, 59, 999))
        expect(Date.from('2017-02-X8').max)
          .to.eql(global.Date.UTC(2017, 1, 28, 23, 59, 59, 999))
        expect(Date.from('2017-02-X9').max)
          .to.eql(global.Date.UTC(2017, 1, 19, 23, 59, 59, 999))

        expect(Date.from('2016-09-X1').max)
          .to.eql(global.Date.UTC(2016, 8, 21, 23, 59, 59, 999))
      })

      it('YYYY-MX', () => {
        expect(Date.from('2016-0X').max)
          .to.eql(global.Date.UTC(2016, 8, 30, 23, 59, 59, 999))
        expect(Date.from('2016-1X').max)
          .to.eql(global.Date.UTC(2016, 11, 31, 23, 59, 59, 999))
      })

      it('YYYY-XM', () => {
        expect(Date.from('2016-X1').max)
          .to.eql(global.Date.UTC(2016, 10, 30, 23, 59, 59, 999))
        expect(Date.from('2016-X2').max)
          .to.eql(global.Date.UTC(2016, 11, 31, 23, 59, 59, 999))
      })

      it('YYXY', () => {
        expect(Date.from('20X3').max)
          .to.eql(global.Date.UTC(2093, 11, 31, 23, 59, 59, 999))
      })

      it('YXYY', () => {
        expect(Date.from('2X13').max)
          .to.eql(global.Date.UTC(2913, 11, 31, 23, 59, 59, 999))
      })

      it('YXYX', () => {
        expect(Date.from('2X1X').max)
          .to.eql(global.Date.UTC(2919, 11, 31, 23, 59, 59, 999))
      })

      it('YXXY', () => {
        expect(Date.from('2XX3').max)
          .to.eql(global.Date.UTC(2993, 11, 31, 23, 59, 59, 999))
      })

      it('YXXX', () => {
        expect(Date.from('2XXX').max)
          .to.eql(global.Date.UTC(2999, 11, 31, 23, 59, 59, 999))
      })

      it('XYYY', () => {
        expect(Date.from('X016').max)
          .to.eql(global.Date.UTC(9016, 11, 31, 23, 59, 59, 999))
      })

      it('XYYX', () => {
        expect(Date.from('X01X').max)
          .to.eql(global.Date.UTC(9019, 11, 31, 23, 59, 59, 999))
      })

      it('XYXY', () => {
        expect(Date.from('X0X6').max)
          .to.eql(global.Date.UTC(9096, 11, 31, 23, 59, 59, 999))
      })

      it('-XYXY', () => {
        expect(Date.from('-X0X6').values).to.eql([-6])
      })

      it('XYXX', () => {
        expect(Date.from('X0XX').max)
          .to.eql(global.Date.UTC(9099, 11, 31, 23, 59, 59, 999))
      })

      it('XXYY', () => {
        expect(Date.from('XX16').max)
          .to.eql(global.Date.UTC(9916, 11, 31, 23, 59, 59, 999))
      })

      it('XXYX', () => {
        expect(Date.from('XX1X').max)
          .to.eql(global.Date.UTC(9919, 11, 31, 23, 59, 59, 999))
      })

      it('XXXY', () => {
        expect(Date.from('XXX6').max)
          .to.eql(global.Date.UTC(9996, 11, 31, 23, 59, 59, 999))
      })
    })
  })

  describe('min', () => {
    describe('Level 1', () => {
      it('YYYY', () => {
        expect(new Date([2016]).min)
          .to.eql(global.Date.UTC(2016, 0, 1, 0, 0, 0, 0))
      })

      it('YYYY-MM', () => {
        expect(new Date([2016, 1]).min)
          .to.eql(global.Date.UTC(2016, 1, 1, 0, 0, 0, 0))
        expect(new Date([2017, 1]).min)
          .to.eql(global.Date.UTC(2017, 1, 1, 0, 0, 0, 0))
        expect(new Date([2016, 7]).min)
          .to.eql(global.Date.UTC(2016, 7, 1, 0, 0, 0, 0))
      })

      it('YYYY-MM-DD', () => {
        expect(new Date([2016, 1, 1]).min)
          .to.eql(global.Date.UTC(2016, 1, 1, 0, 0, 0, 0))
      })

      it('YYYY-MM-XX', () => {
        expect(Date.from('2016-01-XX').min)
          .to.eql(global.Date.UTC(2016, 0, 1, 0, 0, 0, 0))
      })

      it('YYYY-XX', () => {
        expect(Date.from('2016-XX').min)
          .to.eql(global.Date.UTC(2016, 0, 1, 0, 0, 0, 0))
      })

      it('YYXX', () => {
        expect(Date.from('20XX').min)
          .to.eql(global.Date.UTC(2000, 0, 1, 0, 0, 0, 0))
      })

      it('YYYX', () => {
        expect(Date.from('201X').min)
          .to.eql(global.Date.UTC(2010, 0, 1, 0, 0, 0, 0))
      })

      it('XXXX', () => {
        expect(Date.from('XXXX').min)
          .to.eql(Date.UTC(0, 0, 1, 0, 0, 0, 0))
      })

      it('XXXX-XX', () => {
        expect(Date.from('XXXX-XX').min)
          .to.eql(Date.UTC(0, 0, 1, 0, 0, 0, 0))
      })

      it('XXXX-XX-XX', () => {
        expect(Date.from('XXXX-XX-XX').min)
          .to.eql(Date.UTC(0, 0, 1, 0, 0, 0, 0))
      })
    })

    describe('Level 2', () => {
      it('YYYX-MM-DD', () => {
        expect(Date.from('201X-02-04').min)
          .to.eql(global.Date.UTC(2010, 1, 4, 0, 0, 0, 0))
      })

      it('YYYX-MM', () => {
        expect(Date.from('201X-02').min)
          .to.eql(global.Date.UTC(2010, 1, 1, 0, 0, 0, 0))
      })

      it('YYXX-MM-DD', () => {
        expect(Date.from('20XX-02-04').min)
          .to.eql(global.Date.UTC(2000, 1, 4, 0, 0, 0, 0))
      })

      it('YYXX-XX-DD', () => {
        expect(Date.from('20XX-XX-04').min)
          .to.eql(global.Date.UTC(2000, 0, 4, 0, 0, 0, 0))
      })

      it('YXYY-MX-XD', () => {
        expect(Date.from('2X12-1X-X4').min)
          .to.eql(global.Date.UTC(2012, 9, 4, 0, 0, 0, 0))
      })

      it('YXXX', () => {
        expect(Date.from('1XXX').min)
          .to.eql(Date.UTC(1000, 0, 1, 0, 0, 0, 0))
      })

      it('-YXXX', () => {
        expect(Date.from('-1XXX').min)
          .to.eql(Date.UTC(-1999, 0, 1, 0, 0, 0, 0))
      })
    })
  })

  describe('.edtf', () => {
    it('default', () =>
      expect(new Date().edtf)
        .to.match(/^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d\d\dZ$/))

    it('YYYY', () => {
      expect(new Date([2014]).edtf).to.eql('2014')
      expect(new Date([123]).edtf).to.eql('0123')
      expect(new Date([14]).edtf).to.eql('0014')
      expect(new Date([0]).edtf).to.eql('0000')
      expect(new Date([-2]).edtf).to.eql('-0002')
      expect(new Date([-42]).edtf).to.eql('-0042')
      expect(new Date([-9999]).edtf).to.eql('-9999')
    })

    it('YYYY-MM', () => {
      expect(new Date([2014, 3]).edtf).to.eql('2014-04')
      expect(new Date([123, 0]).edtf).to.eql('0123-01')
      expect(new Date([14, 8]).edtf).to.eql('0014-09')
      expect(new Date([0, 0]).edtf).to.eql('0000-01')
      expect(new Date([-2, 11]).edtf).to.eql('-0002-12')
    })

    it('YYYY-MM-DD', () => {
      expect(new Date([2014, 3, 15]).edtf).to.eql('2014-04-15')
      expect(new Date([2016, 1, 29]).edtf).to.eql('2016-02-29')
      expect(new Date([2015, 1, 29]).edtf).to.eql('2015-03-01')
    })

    it('YYYY-MM-XX', () =>
      expect(new Date({ values: [2014, 3, 15], unspecified: 'day' }).edtf)
        .to.eql('2014-04-XX'))

    it('YYYY-XX-DD', () =>
      expect(new Date({ values: [2014, 3, 15], unspecified: 'month' }).edtf)
        .to.eql('2014-XX-15'))

    it('XXXX-MM-DD', () =>
      expect(new Date({ values: [2014, 3, 15], unspecified: 'year' }).edtf)
        .to.eql('XXXX-04-15'))

    it('XXXX-XX-DD', () =>
      expect(new Date({ values: [2014, 3, 15], unspecified: 'xxxxxxdd' }).edtf)
        .to.eql('XXXX-XX-15'))

    it('-YYXX-MM-DD', () =>
      expect(new Date({ values: [-300, 3, 15], unspecified: 'yyxxmmdd' }).edtf)
        .to.eql('-03XX-04-15'))

    it('YXYX-MX-DD', () =>
      expect(new Date({ values: [2014, 3, 15], unspecified: 'yxyxmxdd' }).edtf)
        .to.eql('2X1X-0X-15'))

    it('YYYY-MM-DD?', () =>
      expect(new Date({ values: [2014, 3, 15], uncertain: true }).edtf)
        .to.eql('2014-04-15?'))

    it('YYYY-MM-?DD', () =>
      expect(new Date({ values: [2014, 3, 15], uncertain: 'day' }).edtf)
        .to.eql('2014-04-?15'))

    it('YYYY-MM?-DD', () =>
      expect(new Date({ values: [2014, 3, 15], uncertain: 'xxxxxxdd' }).edtf)
        .to.eql('2014-04?-15'))

    it('YYYY-?MM-DD', () =>
      expect(new Date({ values: [2014, 3, 15], uncertain: 'month' }).edtf)
        .to.eql('2014-?04-15'))

    it('YYYY?-MM-DD', () =>
      expect(new Date({ values: [2014, 3, 15], uncertain: 'year' }).edtf)
        .to.eql('2014?-04-15'))

    it('YYYY-MM?-~DD', () =>
      expect(new Date({
        values: [2004, 5, 11], uncertain: 'xxxxxxdd', approximate: 'day'
      }).edtf).to.eql('2004-06?-~11'))

    it('YYYY-%MM-DD', () =>
      expect(new Date({
        values: [2004, 5, 11], uncertain: 'month', approximate: 'month'
      }).edtf).to.eql('2004-%06-11'))

    it('YYYY%-MM-DD', () =>
      expect(new Date({
        values: [2004, 5, 11], uncertain: 'year', approximate: 'year'
      }).edtf).to.eql('2004%-06-11'))

    it('YYYY?-MM~-DD', () =>
      expect(new Date({
        values: [2004, 5, 11], uncertain: 'year', approximate: 'xxxxxxdd'
      }).edtf).to.eql('2004?-06~-11'))

    it('YYYY?-MM-?DD', () =>
      expect(new Date({
        values: [2004, 5, 11], uncertain: 'xxxxmmxx'
      }).edtf).to.eql('2004?-06-?11'))

    it('YYYY-?MM-?DD', () =>
      expect(new Date({
        values: [2004, 5, 11], uncertain: 'yyyyxxxx'
      }).edtf).to.eql('2004-?06-?11'))
  })

  describe('.format', () => {
    it('YYYY', () =>
      expect(new Date([2014]).format('en-US')).to.eql('2014'))

    it('YYYY-MM', () =>
      expect(new Date([2014, 3]).format('en-US')).to.eql('4/2014'))

    it('YYYY-MM-DD', () =>
      expect(new Date([2014, 3, 1]).format('en-US')).to.eql('4/1/2014'))
  })
})

describe('Leap year', () => {
  it('YYXX-02-29', () => {
    let date = new Date({
      values: [2100, 1, 29],
      unspecified: 12
    })

    expect(date.edtf).to.eql('21XX-02-29')

    date = new Date('21XX-02-29')

    expect(date.edtf).to.eql('21XX-02-29')
  })

  it('.next()', () => {
    let date = new Date('201X-02-28')
    expect(date.next().edtf).to.eql('201X-02-29')
  })

  it('.prev()', () => {
    let date = new Date('201X-03-01')
    expect(date.prev().edtf).to.eql('201X-02-29')
  })
})
