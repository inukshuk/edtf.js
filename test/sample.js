import { parse as p } from '../index.js'
import { sample } from '../src/sample.js'

describe('sample', () => {
  it('iterator', () => {
    expect([...sample({ count: 5 })]).to.have.length(5)
  })

  describe('constraints', () => {
    it('level 0', () =>
      expect(Array.from(sample({ count: 10, level: 0 })))
        .to.satisfy(dates => dates.every(d => p(d).level === 0)))

    it('level 1', () =>
      expect(Array.from(sample({ count: 10, level: 1 })))
        .to.satisfy(dates => dates.every(d => p(d).level <= 1)))

    it('level 2', () =>
      expect(Array.from(sample({ count: 10, level: 2 })))
        .to.satisfy(dates => dates.every(d => p(d).level <= 2)))

    it('impossible combinations', () => {
      expect(() => sample({ level: 0, type: 'Season' }).next())
        .to.throw('impossible')

      expect(() => sample({ level: 1, type: 'Set' }).next())
        .to.throw('impossible')
    })
  })
})
