import edtf, { format } from '../index.js'

const canFormatToParts =
  typeof Intl.DateTimeFormat.prototype.formatToParts === 'function'

describe('format', () => {
  it('is a function', () =>
    expect(format).to.be.a('function'))

  it('formats normal dates', () => {
    expect(format(new Date(2017, 4, 9), 'en-US')).to.eql('5/9/2017')
  })

  it('formats extended dates based on precision', () => {
    expect(format(edtf('2017'))).to.eql('2017')
    expect(format(edtf('2017-09'))).to.eql('9/2017')
    expect(format(edtf('2017-09-06'))).to.eql('9/6/2017')
  })

  describe('year precision', () => {
    it('formats parsed year-only strings as year', () => {
      expect(format(edtf('2017'))).to.eql('2017')
      expect(format(edtf('1999'))).to.eql('1999')
      expect(format(edtf('0800'))).to.eql('800')
      expect(format(edtf('2000'))).to.eql('2000')
    })
  })

  describe('year-month precision', () => {
    it('formats parsed year-month strings as month/year', () => {
      expect(format(edtf('2017-01'))).to.eql('1/2017')
      expect(format(edtf('2017-06'))).to.eql('6/2017')
      expect(format(edtf('2017-12'))).to.eql('12/2017')
      expect(format(edtf('1999-03'))).to.eql('3/1999')
    })
  })

  describe('year-month-day precision', () => {
    it('formats parsed full date strings as month/day/year', () => {
      expect(format(edtf('2017-01-01'))).to.eql('1/1/2017')
      expect(format(edtf('2017-06-15'))).to.eql('6/15/2017')
      expect(format(edtf('2017-12-31'))).to.eql('12/31/2017')
      expect(format(edtf('2016-02-29'))).to.eql('2/29/2016')
    })
  })

  describe('datetime precision', () => {
    it('formats parsed datetime strings with time', () => {
      let output = format(edtf('2017-06-15T12:00:00Z'), 'en-US')
      expect(output).to.match(/6\/15\/2017/)
      expect(output).to.match(/12:00:00/)
    })
  })

  it('accepts standard options', () => {
    expect(format(edtf('2017-09-06'), 'en-US', {
      month: 'short',
      weekday: 'short'
    })).to.eql('Wed, Sep 6, 2017')
  })

  it('formats uncertain/approximate dates', () => {
    expect(format(edtf('2017?'))).to.eql('2017 (?)')
    expect(format(edtf('2017~'))).to.eql('c. 2017')
  })

  it('formats unspecified parts', canFormatToParts ? () => {
    expect(format(edtf('2017-09-XX'), 'en-US', {
      month: 'short'
    })).to.eql('Sep X, 2017')

    expect(format(edtf('2017-XX-06'), 'en-US', {
      month: 'short'
    })).to.eql('XXX 6, 2017')

    expect(format(edtf('XXXX-09-06'), 'en-US', {
      month: 'short',
      year: '2-digit'
    })).to.eql('Sep 6, XX')

  } : null)

  it('formats datetime with explicit offset', () => {
    let date = edtf('2014-12-08T11:46:42+02:00')

    expect(date.timeZone).to.eql('+02:00')

    expect(format(date, 'en-US'))
      .to.match(/11:46:42\sAM\sGMT\+2/)

    expect(format(date, 'en-US', { timeZone: 'UTC', timeZoneName: 'short' }))
      .to.match(/9:46:42\sAM\sUTC/)
  })

  it('formats datetime with Z as UTC with label', () => {
    let date = edtf('2014-12-08T11:46:42Z')

    expect(date.timeZone).to.eql('+00:00')

    expect(format(date, 'en-US'))
      .to.match(/11:46:42\sAM\s(UTC|GMT)/)
  })

  it('formats datetime without offset in local time, no label', () => {
    let date = edtf('2014-12-08T11:46:42')

    expect(date.timeZone).to.eql(undefined)

    let output = format(date, 'en-US')
    expect(output).to.match(/11:46:42/)
    expect(output).not.to.match(/UTC|GMT/)
  })

  it('supports programmatic timeZone', () => {
    let date = edtf('2014-12-08T11:46:42Z')
    date.timeZone = 'America/New_York'

    expect(format(date, 'en-US'))
      .to.match(/6:46:42\sAM\sEST/)
  })

  it('allows overriding timeZoneName', () => {
    let date = edtf('2014-12-08T11:46:42+02:00')

    expect(format(date, 'en-US', { timeZoneName: 'longOffset' }))
      .to.match(/11:46:42\sAM\sGMT\+02:00/)
  })

  it('formats simple intervals', () => {
    expect(format(edtf('2017/2025'))).to.eql('2017 – 2025')
    expect(format(edtf('2017-01/2025-03'))).to.eql('1/2017 – 3/2025')
    expect(format(edtf('2017-01/2017-03'))).to.eql('1/2017 – 3/2017')
    expect(format(edtf('2017-01-10/2017-03-14')))
      .to.eql('1/10/2017 – 3/14/2017')
  })
})
