'use strict'

const edtf = require('..')

describe('ISO 8601', () => {

  it('YYYY-MM-DD', () =>
    expect(edtf('2005-05-31')).to.have.ymd([2005, 4, 31]))

  it('YYYY-MM-DDTHH:MM:SS', () =>
    expect(edtf('2014-12-08T11:46:42'))
      .to.have.ymd([2014, 11, 8]).and.hms([11, 46, 42]))

  it('YYYY-MM-DDTHH:MM:SS.sss', () =>
    expect(edtf('2014-12-08T11:46:42.123'))
      .to.have.ymd([2014, 11, 8])
      .and.hms([11, 46, 42]).and.ms(123))

  it('YYYY-MM-DDTHH:MM:SSZ', () =>
    expect(edtf('2014-12-08T11:46:42Z'))
      .to.have.ymd([2014, 11, 8]).and.hms([11, 46, 42]))
})
