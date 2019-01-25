'use strict'

const edtf = require('..')

describe('ISO 8601-1', () => {
  let H, M

  before(() => {
    let offset = new Date().getTimezoneOffset()
    H = offset / 60
    M = offset % 60
  })

  it('YYYY-MM-DD', () =>
    expect(edtf('2005-05-31')).to.have.ymd([2005, 4, 31]))

  it('YYYY-MM-DDTHH:MM:SS', () => {
    expect(edtf('2014-12-08T11:46:42'))
      .to.have.ymd([2014, 11, 8]).and.hms([11 + H, 46 + M, 42])
    expect(edtf('2014-12-08T11:46:42Z'))
      .to.have.ymd([2014, 11, 8]).and.hms([11, 46, 42])

    expect(edtf('1914-12-08T11:46:42Z'))
      .to.have.ymd([1914, 11, 8]).and.hms([11, 46, 42])
    expect(edtf('0014-12-08T11:46:42'))
      .to.have.ymd([14, 11, 8]).and.hms([11 + H, 46 + M, 42])

    expect(edtf('1970-12-08T11:46:42Z'))
      .to.have.ymd([1970, 11, 8]).and.hms([11, 46, 42])
    expect(edtf('0070-12-08T11:46:42Z'))
      .to.have.ymd([70, 11, 8]).and.hms([11, 46, 42])

    expect(edtf('1974-12-08T11:46:42Z'))
      .to.have.ymd([1974, 11, 8]).and.hms([11, 46, 42])
    expect(edtf('0074-12-08T11:46:42Z'))
      .to.have.ymd([74, 11, 8]).and.hms([11, 46, 42])

    expect(edtf('1899-12-31T23:59:59Z'))
      .to.have.ymd([1899, 11, 31]).and.hms([23, 59, 59])
    expect(edtf('1899-12-31T24:00:00Z'))
      .to.have.ymd([1900, 0, 1]).and.hms([0, 0, 0])
    expect(edtf('1900-01-01T00:00:00Z'))
      .to.have.ymd([1900, 0, 1]).and.hms([0, 0, 0])

    expect(edtf('-0001-12-31T23:59:59Z'))
      .to.have.ymd([-1, 11, 31]).and.hms([23, 59, 59])
    expect(edtf('-0001-12-31T24:00:00Z'))
      .to.have.ymd([0, 0, 1]).and.hms([0, 0, 0])
    expect(edtf('0000-01-01T00:00:00Z'))
      .to.have.ymd([0, 0, 1]).and.hms([0, 0, 0])
    expect(edtf('0000-03-01T11:46:42Z'))
      .to.have.ymd([0, 2, 1]).and.hms([11, 46, 42])
    expect(edtf('0001-12-08T11:46:42Z'))
      .to.have.ymd([1, 11, 8]).and.hms([11, 46, 42])


    expect(edtf('1999-12-31T23:59:59Z'))
      .to.have.ymd([1999, 11, 31]).and.hms([23, 59, 59])
    expect(edtf('1999-12-31T24:00:00Z'))
      .to.have.ymd([2000, 0, 1]).and.hms([0, 0, 0])
    expect(edtf('2000-01-01T00:00:00Z'))
      .to.have.ymd([2000, 0, 1]).and.hms([0, 0, 0])
  })

  it('YYYY-MM-DDTHH:MM:SS.sss', () =>
    expect(edtf('2014-12-08T11:46:42.123'))
      .to.have.ymd([2014, 11, 8])
      .and.hms([11 + H, 46 + M, 42]).and.ms(123))

  it('YYYY-MM-DDTHH:MM:SSZ', () =>
    expect(edtf('0014-12-08T11:46:42Z'))
      .to.have.ymd([14, 11, 8]).and.hms([11, 46, 42]))

  it('YYYY-MM-DDTHH:MM:SS+02:00', () =>
    expect(edtf('2014-12-08T11:46:42+02:00'))
      .to.have.ymd([2014, 11, 8]).and.hms([13, 46, 42]))
})
