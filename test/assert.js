import assert, { equal } from '../src/assert.js'

describe('assert', () => {
  it('checks input for being truthy', () => {
    expect(assert(true)).to.be.ok
    expect(assert(1)).to.be.ok

    expect(
      () => assert()
    ).to.throw(Error)

    expect(
      () => assert(false, 'it is false')
    ).to.throw('it is false')

    expect(
      () => assert(0, 'it is zero')
    ).to.throw('it is zero')
  })

  describe('.equal', () => {
    it('tests shallow, coercive equality', () => {
      expect(equal(1, 1)).to.be.ok
      expect(equal(1, '1')).to.be.ok
      expect(equal(NaN, NaN)).to.be.ok

      expect(
        () => equal(1, 2)
      ).to.throw(Error)

      expect(
        () => equal({ a: { b: 1 } }, { a: { b: 1 } })
      ).to.throw(Error)
    })
  })
})
