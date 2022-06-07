import { parse as p, parser } from '../src/parser.js'
import nearley from 'nearley'

describe('parser', () => {
  it('returns a parser instance', () =>
    expect(parser()).to.be.instanceof(nearley.Parser))

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

      expect(p('2016-05-02T16:54:59'))
        .to.have.property('offset', new Date().getTimezoneOffset())
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

    it('YYYY-MM-DDThh:mm:ss[+-]hhmm', () => {
      expect(p('2016-05-02T16:54:59+0230'))
        .to.produce([2016, 4, 2, 16, 54, 59])
        .at.level(0)
        .and.have.property('offset', 150)

      expect(p('2016-05-02T16:54:59+0000')).to.have.property('offset', 0)
      expect(p('2016-05-02T16:54:59+1400')).to.have.property('offset', 840)
      expect(p('2016-05-02T16:54:59+1330')).to.have.property('offset', 810)
      expect(p('2016-05-02T16:54:59+1200')).to.have.property('offset', 720)
      expect(p('2016-05-02T16:54:59+0410')).to.have.property('offset', 250)
      expect(p('2016-05-02T16:54:59-0015')).to.have.property('offset', -15)
      expect(p('2016-05-02T16:54:59-1159')).to.have.property('offset', -719)
      expect(p('2016-05-02T16:54:59-1200')).to.have.property('offset', -720)

      expect(() => p('2016-05-02T12:00:00-0000')).to.be.rejected
      expect(() => p('2016-05-02T12:00:00-2000')).to.be.rejected
      expect(() => p('2016-05-02T12:00:00-1201')).to.be.rejected
      expect(() => p('2016-05-02T12:00:00-1300')).to.be.rejected
      expect(() => p('2016-05-02T12:00:00-1400')).to.be.rejected
      expect(() => p('2016-05-02T12:00:00+1401')).to.be.rejected
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

    it('YY', () => {
      expect(p('19')).to.produce([19]).at.level(0).and.be.a.century
      expect(p('00')).to.produce([0]).at.level(0).and.be.a.century
    })

    it('-YY', () => {
      expect(p('-04')).to.produce([-4]).at.level(0).and.be.a.century
      expect(() => p('-00')).to.be.rejected
    })

    it('YYYY/YYYY', () =>
      expect(p('1980/1994'))
        .to.be.an.interval.from([1980]).through([1994]).at.level(0))

    it('YYYY-MM/YYYY', () =>
      expect(p('1980-08/1994'))
        .to.be.an.interval.from([1980, 7]).through([1994]).at.level(0))

    it('YYYY-MM-DD/YYYY', () =>
      expect(p('2004-02-01/2005'))
        .to.be.an.interval.from([2004, 1, 1]).through([2005]).at.level(0))

    it('YYYY-MM/YYYY-MM', () =>
      expect(p('2004-06/2006-08'))
        .to.be.an.interval.from([2004, 5]).through([2006, 7]).at.level(0))

    it('YYYY-MM-DD/YYYY-MM-DD', () =>
      expect(p('2004-02-01/2005-02-08'))
        .to.be.an.interval.from([2004, 1, 1]).through([2005, 1, 8]).at.level(0))

    it('YYYY-MM-DDThh:mm:ss/YYYY-MM-DD', () =>
      expect(p('2004-02-01/2005-02-08'))
        .to.be.an.interval.from([2004, 1, 1]).through([2005, 1, 8]).at.level(0))
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

    it('YYYY-MM-XX', () => {
      expect(p('2016-05-XX'))
        .to.produce([2016, 4, 1]).at.level(1)
        .and.have.unspecified('day')
        .and.not.have.unspecified('month')
        .and.not.have.unspecified('year')

      expect(() => p('2016-13-XX')).to.be.rejected
    })

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
      expect(p('Y170002'))
        .to.produce([170002]).at.level(1)
        .and.have.type('Year')

      expect(p('Y10000'))
        .to.produce([10000]).at.level(1)
        .and.have.type('Year')

      expect(() => p('Y9999')).to.be.rejected
      expect(() => p('Y00001')).to.be.rejected
    })

    it('"Y"-YYYYY...', () => {
      expect(p('Y-170002'))
        .to.produce([-170002]).at.level(1)
        .and.have.type('Year')

      expect(p('Y-10000'))
        .to.produce([-10000]).at.level(1)
        .and.have.type('Year')

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
        .to.be.an.interval.from([1980]).through([1994]).at.level(1))

    it('/', () =>
      expect(p('/'))
        .to.be.an.interval.at.level(1).and.produce([null, null]))

    it('../..', () =>
      expect(p('../..'))
        .to.be.an.interval.at.level(1).and.produce([Infinity, Infinity]))

    it('../2016', () =>
      expect(p('../2016'))
        .to.be.an.interval.through([2016]).at.level(1))

    it('YYYY-MM/..', () =>
      expect(p('2016-05/..'))
        .to.be.an.interval.from([2016, 4]).at.level(1))

    it('YYYY-MM-DD/..', () =>
      expect(p('2004-06-01/..'))
        .to.be.an.interval.from([2004, 5, 1]).at.level(1))

    it('/YYYY-MM', () =>
      expect(p('/2016-05'))
        .to.be.an.interval.through([2016, 4]).at.level(1))

    it('YYYY-MM-DD/', () =>
      expect(p('2016-05-31/..'))
        .to.be.an.interval.from([2016, 4, 31]).at.level(1))
  })

  describe('Level 2', () => {
    it('?YYYY', () =>
      expect(p('?2001')).to.produce([2001]).at.level(2)
        .and.have.uncertain('year'))

    it('YYYY~-MM', () =>
      expect(p('2001~-09')).to.produce([2001, 8]).at.level(2)
        .and.have.approximate('year').precise('month'))

    it('YYYY-?MM~-DD', () =>
      expect(p('2001-?09~-09')).to.produce([2001, 8, 9]).at.level(2)
        .and.have.approximate('year').and.approximate('month')
        .and.uncertain('month').and.certain('year').certain('day'))

    it('YYYY?-MM-~DD', () =>
      expect(p('2004?-06-~11'))
        .to.produce([2004, 5, 11]).at.level(2)
        .and.have.uncertain('year')
        .and.approximate('day')
        .and.certain('month')
        .and.certain('day'))

    it('YYYX-MM-DD', () => {
      expect(p('156X-12-31'))
        .to.produce([1560, 11, 31]).at.level(2)
        .and.have.unspecified('year')
        .and.specified('month')
        .and.specified('day')

      expect(() => p('156X-09-31')).to.be.rejected
      expect(() => p('156X-11-31')).to.be.rejected
    })

    it('YYXX-MM-DD', () =>
      expect(p('15XX-12-25'))
        .to.produce([1500, 11, 25]).at.level(2)
        .and.have.unspecified('year')
        .and.specified('month')
        .and.specified('day'))

    it('YYXX-MM-XX', () =>
      expect(p('15XX-12-XX'))
        .to.produce([1500, 11, 1]).at.level(2)
        .and.have.unspecified('year')
        .and.unspecified('day')
        .and.specified('month'))

    it('YYXX-MM-DX', () => {
      expect(p('15XX-01-3X'))
        .to.produce([1500, 0, 30]).at.level(2)
      expect(() => p('15XX-02-3X')).to.be.rejected
    })

    it('YYXX-XX-DD', () =>
      expect(p('15XX-XX-25'))
        .to.produce([1500, 0, 25]).at.level(2)
        .and.have.unspecified('year')
        .and.unspecified('month')
        .and.specified('day'))

    it('YYYY-MX-DD', () => {
      expect(p('1500-1X-25'))
        .to.produce([1500, 9, 25]).at.level(2)
        .and.have.unspecified('month')
        .and.specified('year')
        .and.specified('day')

      expect(p('15XX-0X-25'))
        .to.produce([1500, 0, 25]).at.level(2)

      expect(() => p('15XX-2X-25')).to.be.rejected
    })

    it('YYXX-XM', () =>
      expect(p('15XX-X2'))
        .to.produce([1500, 1]).at.level(2)
        .and.have.unspecified('year')
        .and.have.unspecified('month')
        .and.specified('day'))

    it('YXXX-XX', () =>
      expect(p('1XXX-XX'))
        .to.produce([1000, 0]).at.level(2)
        .and.have.unspecified('year')
        .and.have.unspecified('month')
        .and.specified('day'))

    it('YXXX-MM', () =>
      expect(p('1XXX-12'))
        .to.produce([1000, 11]).at.level(2)
        .and.have.unspecified('year')
        .and.specified('month')
        .and.specified('day'))

    it('YXXY', () =>
      expect(p('1XX3'))
        .to.produce([1003]).at.level(2)
        .and.have.unspecified('year')
        .and.specified('month')
        .and.specified('day'))

    it('YKEK', () =>
      expect(p('Y17E7'))
        .to.produce([170000000]).at.level(2)
        .and.have.type('Year'))

    it('Y-KEK', () =>
      expect(p('Y-17E7'))
        .to.produce([-170000000]).at.level(2)
        .and.have.type('Year'))

    it('YYYYS2', () =>
      expect(p('1950S2'))
        .to.produce([1950]).at.level(2)
        .and.have.type('Year')
        .and.have.property('significant', 2))

    it('YYYYYYS3', () =>
      expect(p('Y17101000S3'))
        .to.produce([17101000]).at.level(2)
        .and.have.type('Year')
        .and.have.property('significant', 3))

    it('Y-YYYYE3S3', () =>
      expect(p('Y-17101E3S3'))
        .to.produce([-17101000]).at.level(2)
        .and.have.type('Year')
        .and.have.property('significant', 3))

    it('YYYY-SS', () => {
      expect(p('2001-25'))
        .to.produce([2001, 25]).at.level(2).and.be.a.season

      expect(p('2001-36'))
        .to.produce([2001, 36]).at.level(2).and.be.a.season

      expect(p('2001-39'))
        .to.produce([2001, 39]).at.level(2).and.be.a.season
    })

    it('YYY', () => {
      expect(p('193')).to.produce([193]).at.level(2).and.be.a.decade
      expect(p('019')).to.produce([19]).at.level(2).and.be.a.decade
      expect(p('009')).to.produce([9]).at.level(2).and.be.a.decade
      expect(p('000')).to.produce([0]).at.level(2).and.be.a.decade
    })

    it('-YYY', () => {
      expect(p('-193')).to.produce([-193]).at.level(2).and.be.a.decade
      expect(p('-019')).to.produce([-19]).at.level(2).and.be.a.decade
      expect(() => p('-000')).to.be.rejected
    })

    it('YYY~', () =>
      expect(p('197~')).to.produce([197]).at.level(2)
        .and.be.an.approximate().decade.and.not.uncertain())

    it('YYY?', () =>
      expect(p('197?')).to.produce([197]).at.level(2)
        .and.be.an.uncertain().decade.and.not.approximate())

    it('YYY%', () =>
      expect(p('197%')).to.produce([197]).at.level(2)
        .and.be.an.uncertain().and.approximate().decade)

    it('YY~', () =>
      expect(p('19~')).to.produce([19]).at.level(2)
        .and.be.an.approximate().century.and.not.uncertain())

    it('YY?', () =>
      expect(p('19?')).to.produce([19]).at.level(2)
        .and.be.an.uncertain().century.and.not.approximate())

    it('YY%', () =>
      expect(p('19%')).to.produce([19]).at.level(2)
        .and.be.an.uncertain().and.approximate().century)

    it('YYYY-MM-~DD/YYYY-MM-~DD', () =>
      expect(p('2004-06-~01/2004-06-~20'))
        .to.be.an.interval.at.level(2)
        .from([2004, 5, 1]).through([2004, 5, 20]))

    it('YYYY-MM-XX/YYYY-MM-DD', () =>
      expect(p('2004-06-XX/2004-07-03'))
        .to.be.an.interval.at.level(2)
        .from([2004, 5, 1]).through([2004, 6, 3]))

    it('[YYYY,YYYY..YYYY]', () => {
      let set = p('[1667,1668, 1670..1672]')

      expect(set).to.be.a.set.at.level(2)
      expect(set.values).to.have.length(3)
      expect(set.values[0]).to.produce([1667])
      expect(set.values[1]).to.produce([1668])
      expect(set.values[2]).to.have.length(2)
      expect(set.values[2][0]).to.produce([1670])

      expect(() => p('[1999}')).to.be.rejected
      expect(() => p('{1999]')).to.be.rejected
      expect(() => p('[1999')).to.be.rejected
      expect(() => p('{1999')).to.be.rejected
    })

    it('[..YYYY-MM-DD]', () =>
      expect(p('[..1760-12-03]'))
        .to.be.a.set.at.level(2).and.have.property('earlier', true))

    it('[YYYY-MM..]', () =>
      expect(p('[1760-12..]'))
        .to.be.a.set.at.level(2).and.have.property('later', true))

    it('[YYYY..]', () =>
      expect(p('[1760..]'))
        .to.be.a.set.at.level(2).and.have.property('later', true))

    it('[YYYY,YYYY-MM]', () =>
      expect(p('[1667, 1672-12]'))
        .to.be.a.set.at.level(2).from([1667]).through([1672, 11]))

    it('{YYYY,YYYY..YYYY}', () =>
      expect(p('{1667, 1670..1672}'))
        .to.be.a.list.at.level(2).from([1667]))
    it('{YYYY,YYYY-MM}', () =>
      expect(p('{1960 ,  1961-12}'))
        .to.be.a.list.at.level(2)
        .from([1960]).through([1961, 11]))

    it('{YYYY..}', () =>
      expect(p('{1760..}'))
        .to.be.a.list.at.level(2).and.have.property('later', true))

    it('{..YYYY}', () =>
      expect(p('{..1760}'))
        .to.be.a.list.at.level(2).and.have.property('earlier', true))
  })

  describe('Level 3 (Non-Standard)', () => {
    it('YYYY-SS/YYYY-SS', () =>
      expect(p('2018-21/2018-23', { level: 3 }))
        .to.be.an.interval.through([2018, 23]).at.level(3))

    it('rejects mixed intervals', () => {
      expect(() => p('2018/2018-23', { level: 3 })).to.be.rejected
      expect(() => p('2018-21/2017-01-01', { level: 3 })).to.be.rejected
      expect(() => p('2018-01?/2018-23', { level: 3 })).to.be.rejected
    })
  })

  describe('constrain', () => {
    it('by type', () => {
      expect(p('[1760..]', { types: ['List', 'Set'] }))
        .to.be.a.set.at.level(2).and.have.property('later', true)

      expect(p('[1760..]', { types: [] }))
        .to.be.a.set.at.level(2).and.have.property('later', true)

      expect(() => p('[1760..]', { types: ['List'] })).to.be.rejected
    })

    it('by level', () => {
      expect(p('[1760..]', { level: 2 }))
        .to.be.a.set.at.level(2).and.have.property('later', true)

      expect(() => p('[1760..]', { level: 1 })).to.be.rejected
      expect(() => p('[1760..]', { level: 0 })).to.be.rejected
    })

    it('by level and type', () => {
      expect(p('1800/1X01', { level: 2, types: ['Interval'] }))
        .to.be.an.interval.at.level(2)

      expect(() => p('1800/1X01', { level: 2, types: ['Date'] }))
        .to.be.rejected
      expect(() => p('1800/1X01', { level: 1, types: ['Interval'] }))
        .to.be.rejected
    })

    describe('by features', () => {
      it('season-intervals', () => {
        expect(() => p('2012-21/2012-22')).to.be.rejected
        expect(p('2012-21/2012-22', { seasonIntervals: true }))
          .to.be.an.interval.at.level(3)
      })
    })
  })

  describe('rejects', () => {
    it('empty string', () => expect(() => p('')).to.be.rejected)
    it('-', () => expect(() => p('-')).to.be.rejected)
  })
})

