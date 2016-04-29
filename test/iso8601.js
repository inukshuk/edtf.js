'use strict'

const edtf = require('..')

describe('ISO 8601', () => {

  it('YYYY-MM-DD', () =>
    expect(edtf('2005-05-31')).to.have.year(2005).and.month(4).and.day(31))

  it('YYYY-MM-DDTHH:MM:SS', () =>
    expect(edtf('2014-12-08T11:46:42'))
      .to.have.year(2014).month(11).and.day(8)
      .and.hours(11).minutes(46).and.seconds(42))

  it('YYYY-MM-DDTHH:MM:SS.sss', () =>
    expect(edtf('2014-12-08T11:46:42.123'))
      .to.have.year(2014).month(11).and.day(8)
      .and.hours(11).minutes(46).seconds(42).and.ms(123))

  it('YYYY-MM-DDTHH:MM:SSZ', () =>
    expect(edtf('2014-12-08T11:46:42Z'))
      .to.have.year(2014).month(11).and.day(8)
      .and.hours(11).minutes(46).and.seconds(42))
})
