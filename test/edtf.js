import edtf, {
  Date as ExtDate,
  Interval,
  List,
  Season,
  Set,
  Year
} from '../index.js'

describe('edtf', () => {

  it('is a function', () =>
    expect(edtf).to.be.a('function'))

  it('returns dates by default', () =>
    expect(edtf()).to.be.a.date.and.an.edtf)

  it('parses strings', () => {
    expect(edtf('2016-03')).to.be.an.edtf.and.produce([2016, 2])

    expect(edtf('[2016-03]')).to.be.instanceof(Set)
    expect(edtf('{2016..2020}')).to.be.instanceof(List)
    expect(edtf('2016/2019')).to.be.instanceof(Interval)
    expect(edtf('/1970-01-02')).to.be.instanceof(Interval)
    expect(edtf('/1969')).to.be.instanceof(Interval)
    expect(edtf('1969/')).to.be.instanceof(Interval)
    expect(edtf('1969/1970')).to.be.instanceof(Interval)
    expect(edtf('1970-02/')).to.be.instanceof(Interval)
    expect(edtf('2016-21')).to.be.instanceof(Season)
    expect(edtf('Y210001')).to.be.instanceof(Year)
  })

  it('parses date instances', () =>
    expect(edtf(new Date(Date.UTC(2014, 11, 8))))
      .to.be.an.edtf.and.produce([2014, 11, 8, 0, 0, 0]))

  it('parses integers', () =>
    expect(edtf(Date.UTC(2014, 11, 8)))
      .to.be.an.edtf.and.produce([2014, 11, 8, 0, 0, 0]))

  it('parses 5+ digits only as Unix epoch', () => {
    expect(edtf('2000'))
      .to.be.an.edtf.and.produce([2000])
    expect(edtf('20000'))
      .to.be.an.edtf.and.produce([1970, 0, 1, 0, 0, 20])
  })

  it('creates new extended date objects', () => {
    expect(edtf([2016, 2])).to.be.an.edtf.and.produce([2016, 2])

    let a = new ExtDate([2016])

    expect(edtf(a))
      .to.be.an.edtf
      .and.produce([2016])
      .and.not.equal(a)
  })

  it('roundtrips', () => {
    for (let string of [
      '2016',
      '2016-05',
      '2016-05-31',
      '2016?',
      '2016-05?',
      '2016-05-31?',
      '2016~-05?',
      '2016-~05',
      '20XX',
      '2XX6',
      '-0300',
      '-0300~',
      '03XX',
      '-0300-XX',
      '-03XX',
      '1985-04/..',
      '../1985'

    ]) expect(edtf(string).edtf).to.eql(string)
  })
})
