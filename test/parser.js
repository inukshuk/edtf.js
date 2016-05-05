'use strict'

const { parse: p, parser } = require('../src/parser')
const { Parser } = require('nearley')

describe('parser', () => {
  it('returns a parser instance', () =>
    expect(parser()).to.be.instanceof(Parser))

  describe('Level 0', () => {
    it('YYYY', () => {
      expect(p('2016')).to.produce([2016]).at.level(0)
      expect(p('0409')).to.produce([409]).at.level(0)
      expect(p('0023')).to.produce([23]).at.level(0)
      expect(p('0007')).to.produce([7]).at.level(0)
      expect(p('0000')).to.produce([0]).at.level(0)
      expect(p('9999')).to.produce([9999]).at.level(0)
      expect(p('-0002')).to.produce([-2]).at.level(0)
      expect(p('-9999')).to.produce([-9999]).at.level(0)

      expect(() => p('-0000')).to.be.rejected
      expect(() => p('12345')).to.be.rejected
    })

    it('YYYY-MM', () => {
      expect(p('2016-05')).to.produce([2016, 4]).at.level(0)
      expect(p('2016-01')).to.produce([2016, 0]).at.level(0)
      expect(p('2016-12')).to.produce([2016, 11]).at.level(0)

      expect(() => p('2016-13')).to.be.rejected
      expect(() => p('2016-00')).to.be.rejected
    })

    it('YYYY-MM-DD', () => {
      expect(p('2016-05-01')).to.produce([2016, 4, 1]).at.level(0)
      expect(p('2016-05-13')).to.produce([2016, 4, 13]).at.level(0)
      expect(p('2016-05-29')).to.produce([2016, 4, 29]).at.level(0)
      expect(p('2016-05-30')).to.produce([2016, 4, 30]).at.level(0)
      expect(p('2016-05-31')).to.produce([2016, 4, 31]).at.level(0)

      expect(() => p('2016-05-00')).to.be.rejected
      expect(() => p('2016-05-32')).to.be.rejected
      expect(() => p('2016-02-30')).to.be.rejected
      expect(() => p('2016-02-31')).to.be.rejected
      expect(() => p('2016-04-31')).to.be.rejected
      expect(() => p('2016-06-31')).to.be.rejected
      expect(() => p('2016-09-31')).to.be.rejected
      expect(() => p('2016-11-31')).to.be.rejected
    })

    it('YYYY-MM-DDThh:mm:ss', () => {
      expect(p('2016-05-02T16:54:59'))
        .to.produce([2016, 4, 2, 16, 54, 59]).at.level(0)
      expect(p('2016-05-02T16:54:59.042'))
        .to.produce([2016, 4, 2, 16, 54, 59, 42]).at.level(0)
      expect(p('2016-05-02T24:00:00'))
        .to.produce([2016, 4, 2, 24, 0, 0]).at.level(0)

      expect(() => p('2016-05-02T24:00:01')).to.be.rejected
      expect(() => p('2016-05-02T00:61:00')).to.be.rejected
      expect(() => p('2016-05-02T01:01:60')).to.be.rejected
    })

    it('YYYY-MM-DDThh:mm:ss.sss', () =>
      expect(p('2016-05-02T16:54:59.042'))
        .to.produce([2016, 4, 2, 16, 54, 59, 42]).at.level(0))

    it('YYYY-MM-DDThh:mm:ssZ', () => {
      expect(p('2016-05-02T16:54:59Z'))
        .to.produce([2016, 4, 2, 16, 54, 59]).at.level(0)
      expect(p('2016-05-02T16:54:59.042Z'))
        .to.produce([2016, 4, 2, 16, 54, 59, 42]).at.level(0)
    })

    it('YYYY-MM-DDThh:mm:ss[+-]hh:mm', () => {
      expect(p('2016-05-02T16:54:59+02:30'))
        .to.produce([2016, 4, 2, 16, 54, 59])
        .at.level(0)
        .and.have.property('offset', 150)

      expect(p('2016-05-02T16:54:59+00:00')).to.have.property('offset', 0)
      expect(p('2016-05-02T16:54:59+14:00')).to.have.property('offset', 840)
      expect(p('2016-05-02T16:54:59+13:30')).to.have.property('offset', 810)
      expect(p('2016-05-02T16:54:59+12:00')).to.have.property('offset', 720)
      expect(p('2016-05-02T16:54:59+04:10')).to.have.property('offset', 250)
      expect(p('2016-05-02T16:54:59-00:15')).to.have.property('offset', -15)
      expect(p('2016-05-02T16:54:59-11:59')).to.have.property('offset', -719)
      expect(p('2016-05-02T16:54:59-12:00')).to.have.property('offset', -720)

      expect(() => p('2016-05-02T12:00:00-00:00')).to.be.rejected
      expect(() => p('2016-05-02T12:00:00-12:01')).to.be.rejected
      expect(() => p('2016-05-02T12:00:00-13:00')).to.be.rejected
      expect(() => p('2016-05-02T12:00:00-14:00')).to.be.rejected
      expect(() => p('2016-05-02T12:00:00+14:01')).to.be.rejected
    })

    it('YYYY-MM-DDThh:mm:ss[+-]hh', () => {
      expect(p('2016-05-02T16:54:59+14'))
        .to.produce([2016, 4, 2, 16, 54, 59])
        .at.level(0)
        .and.have.property('offset', 840)

      expect(p('2016-05-02T16:54:59-12'))
        .to.produce([2016, 4, 2, 16, 54, 59])
        .at.level(0)
        .and.have.property('offset', -720)

      expect(() => p('2016-05-02T12:00:00-00')).to.be.rejected
      expect(() => p('2016-05-02T12:00:00-13')).to.be.rejected
      expect(() => p('2016-05-02T12:00:00-14')).to.be.rejected
      expect(() => p('2016-05-02T12:00:00+15')).to.be.rejected
    })

    it('YY', () =>
      expect(p('19')).to.produce([19]).at.level(0).and.be.a.century)

    it('YYYY/YYYY', () =>
      expect(p('1980/1994'))
        .to.be.an.interval.from([1980]).until([1994]).at.level(0))

    it('YYYY-MM/YYYY', () =>
      expect(p('1980-08/1994'))
        .to.be.an.interval.from([1980, 7]).until([1994]).at.level(0))

    it('YYYY-MM-DD/YYYY', () =>
      expect(p('2004-02-01/2005'))
        .to.be.an.interval.from([2004, 1, 1]).until([2005]).at.level(0))

    it('YYYY-MM/YYYY-MM', () =>
      expect(p('2004-06/2006-08'))
        .to.be.an.interval.from([2004, 5]).until([2006, 7]).at.level(0))

    it('YYYY-MM-DD/YYYY-MM-DD', () =>
      expect(p('2004-02-01/2005-02-08'))
        .to.be.an.interval.from([2004, 1, 1]).until([2005, 1, 8]).at.level(0))

    it('YYYY-MM-DDThh:mm:ss/YYYY-MM-DD', () =>
      expect(p('2004-02-01/2005-02-08'))
        .to.be.an.interval.from([2004, 1, 1]).until([2005, 1, 8]).at.level(0))
  })

  describe('Level 1', () => {
    it('YYYY?', () =>
      expect(p('2016?'))
        .to.produce([2016]).at.level(1)
        .and.be.uncertain().and.not.approximate())

    it('YYYY~', () =>
      expect(p('2016~'))
        .to.produce([2016]).at.level(1)
        .and.be.approximate().and.not.uncertain())

    it('YYYY%', () =>
      expect(p('2016%'))
        .to.produce([2016]).at.level(1)
        .to.be.approximate().and.uncertain())

    it('YYYY-MM?', () =>
      expect(p('2016-05?'))
        .to.produce([2016, 4]).at.level(1).and.be.uncertain())

    it('YYYY-MM~', () =>
      expect(p('2016-05~'))
        .to.produce([2016, 4]).at.level(1).and.be.approximate())

    it('YYYY-MM%', () =>
      expect(p('2016-05%'))
        .to.produce([2016, 4]).at.level(1).and.be.approximate().and.uncertain())

    it('YYYY-MM-DD?', () =>
      expect(p('2016-05-03?'))
        .to.produce([2016, 4, 3]).at.level(1).and.be.uncertain())

    it('YYYY-MM-DD~', () =>
      expect(p('2016-05-03~'))
        .to.produce([2016, 4, 3]).at.level(1).and.be.approximate())

    it('YYYY-MM-DD%', () =>
      expect(p('2016-05-03%'))
        .to.produce([2016, 4, 3]).at.level(1)
        .and.be.approximate().and.uncertain)

    it('YYYY-MM-XX', () =>
      expect(p('2016-05-XX'))
        .to.produce([2016, 4, 1]).at.level(1)
        .and.have.unspecified('day')
        .and.not.have.unspecified('month')
        .and.not.have.unspecified('year'))

    it('YYYY-XX', () =>
      expect(p('2016-XX'))
        .to.produce([2016, 0]).at.level(1)
        .and.have.unspecified('month')
        .and.not.have.unspecified('day')
        .and.not.have.unspecified('year'))

    it('XXXX', () =>
      expect(p('XXXX'))
        .to.produce([0]).at.level(1)
        .and.have.unspecified('year')
        .and.not.have.unspecified('day')
        .and.not.have.unspecified('month'))

    it('YYXX', () =>
      expect(p('19XX'))
        .to.produce([1900]).at.level(1)
        .and.have.unspecified('year')
        .and.not.have.unspecified('day')
        .and.not.have.unspecified('month'))

    it('YYYX', () =>
      expect(p('198X'))
        .to.produce([1980]).at.level(1)
        .and.have.unspecified('year')
        .and.not.have.unspecified('day')
        .and.not.have.unspecified('month'))

    it('XXXX-XX', () =>
      expect(p('XXXX-XX'))
        .to.produce([0, 0]).at.level(1)
        .and.have.unspecified('year')
        .and.have.unspecified('month')
        .and.not.have.unspecified('day'))

    it('XXXX-XX-XX', () =>
      expect(p('XXXX-XX-XX'))
        .to.produce([0, 0, 1]).at.level(1)
        .and.have.unspecified('year')
        .and.have.unspecified('month')
        .and.have.unspecified('day'))

    it('"Y"YYYYY...', () => {
      expect(p('Y170002')).to.produce([170002]).at.level(1)
      expect(p('Y10000')).to.produce([10000]).at.level(1)
      expect(() => p('Y9999')).to.be.rejected
      expect(() => p('Y00001')).to.be.rejected
    })

    it('"Y"-YYYYY...', () => {
      expect(p('Y-170002')).to.produce([-170002]).at.level(1)
      expect(p('Y-10000')).to.produce([-10000]).at.level(1)
      expect(() => p('Y-9999')).to.be.rejected
      expect(() => p('Y-00001')).to.be.rejected
    })

    it('YYYY-SS', () => {
      expect(p('2001-21'))
        .to.produce([2001, 21]).at.level(1).and.be.a.season

      expect(p('2001-22'))
        .to.produce([2001, 22]).at.level(1).and.be.a.season

      expect(p('2001-23'))
        .to.produce([2001, 23]).at.level(1).and.be.a.season

      expect(p('2001-24'))
        .to.produce([2001, 24]).at.level(1).and.be.a.season
    })

    it('YYYY?/YYYY~', () =>
      expect(p('1980?/1994~'))
        .to.be.an.interval.from([1980]).until([1994]).at.level(1))

    it('/', () =>
      expect(p('/'))
        .to.be.an.interval.from([]).until([]).at.level(1))

    it('YYYY-MM/*', () =>
      expect(p('2016-05/*'))
        .to.be.an.interval.from([2016, 4]).until([]).at.level(1))

    it('/YYYY-MM', () =>
      expect(p('/2016-05'))
        .to.be.an.interval.from([]).until([2016, 4]).at.level(1))
  })

  describe('Level 2', () => {

    it('YYYX-MM-DD', () =>
      expect(p('156X-12-25'))
        .to.produce([1560, 11, 25]).at.level(2)
        .and.have.unspecified('year')
        .and.not.unspecified('month')
        .and.not.unspecified('day'))

    it('YYXX-MM-DD', () =>
      expect(p('15XX-12-25'))
        .to.produce([1500, 11, 25]).at.level(2)
        .and.have.unspecified('year')
        .and.not.unspecified('month')
        .and.not.unspecified('day'))

    it('YYXX-MM-XX', () => {
      expect(p('15XX-12-XX'))
        .to.produce([1500, 11, 1]).at.level(2)
        .and.have.unspecified('year')
        .and.have.unspecified('day')
        .and.not.unspecified('month')

      //expect(() => p('15XX-10-31')).to.be.rejected
      //expect(() => p('15XX-02-3X')).to.be.rejected
    })

    it('YYXX-XX-DD', () => {
      expect(p('15XX-XX-25'))
        .to.produce([1500, 0, 25]).at.level(2)
        .and.have.unspecified('year')
        .and.have.unspecified('month')
        .and.not.unspecified('day')

      //expect(() => p('15XX-2X-25')).to.be.rejected
    })

    it('YYXX-XM', () =>
      expect(p('15XX-X2'))
        .to.produce([1500, 1]).at.level(2)
        .and.have.unspecified('year')
        .and.have.unspecified('month')
        .and.not.unspecified('day'))

    it('YXXX-XX', () =>
      expect(p('1XXX-XX'))
        .to.produce([1000, 0]).at.level(2)
        .and.have.unspecified('year')
        .and.have.unspecified('month')
        .and.not.unspecified('day'))

    it('YXXX-MM', () =>
      expect(p('1XXX-12'))
        .to.produce([1000, 11]).at.level(2)
        .and.have.unspecified('year')
        .and.not.unspecified('month')
        .and.not.unspecified('day'))

    it('YXXY', () =>
      expect(p('1XX3'))
        .to.produce([1003]).at.level(2)
        .and.have.unspecified('year')
        .and.not.unspecified('month')
        .and.not.unspecified('day'))

    it('YKEK', () =>
      expect(p('Y17E7')).to.produce([170000000]).at.level(2))
    it('Y-KEK', () =>
      expect(p('Y-17E7')).to.produce([-170000000]).at.level(2))

    it('YYYY-SS', () => {
      expect(p('2001-25'))
        .to.produce([2001, 25]).at.level(2).and.be.a.season

      expect(p('2001-36'))
        .to.produce([2001, 36]).at.level(2).and.be.a.season

      expect(p('2001-39'))
        .to.produce([2001, 39]).at.level(2).and.be.a.season
    })

    it('YYY', () =>
      expect(p('193')).to.produce([193]).at.level(2).and.be.a.decade)

    it('YYY~', () =>
      expect(p('197~')).to.produce([197]).at.level(2)
        .and.be.an.approximate().decade.and.not.uncertain())

    it('YYY?', () =>
      expect(p('197?')).to.produce([197]).at.level(2)
        .and.be.an.uncertain().decade.and.not.approximate())

    it('YYY%', () =>
      expect(p('197%')).to.produce([197]).at.level(2)
        .and.be.an.uncertain().and.approximate().decade)
  })
})

