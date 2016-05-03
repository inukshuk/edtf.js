'use strict'

const edtf = require('../..')
const chai = require('chai')

const { X } = edtf
const { expect, Assertion } = chai

global.expect = expect

chai.use(function (_, utils) {

  Assertion.addProperty('date', function () {
    expect(utils.flag(this, 'object')).to.be.instanceof(Date)
  })

  Assertion.addProperty('edtf', function () {
    expect(utils.flag(this, 'object')).to.be.instanceof(edtf.Date)
  })

  function year(expected) {
    const date = utils.flag(this, 'object')
    expect(date.getUTCFullYear()).to.eql(expected)
  }

  function months(expected) {
    const date = utils.flag(this, 'object')
    expect(date.getUTCMonth()).to.eql(expected)
  }

  function days(expected) {
    const date = utils.flag(this, 'object')
    expect(date.getUTCDate()).to.eql(expected)
  }

  function minutes(expected) {
    const date = utils.flag(this, 'object')
    expect(date.getUTCMinutes()).to.eql(expected)
  }

  function hours(expected) {
    const date = utils.flag(this, 'object')
    expect(date.getUTCHours()).to.eql(expected)
  }

  function seconds(expected) {
    const date = utils.flag(this, 'object')
    expect(date.getUTCSeconds()).to.eql(expected)
  }

  function ms(expected) {
    const date = utils.flag(this, 'object')
    expect(date.getUTCMilliseconds()).to.eql(expected)
  }

  function time(expected) {
    const date = utils.flag(this, 'object')
    expect(date.getUTCTime()).to.eql(expected)
  }

  function ymd(expected) {
    const date = utils.flag(this, 'object')
    expect(date.getUTCFullYear()).to.eql(expected[0])
    expect(date.getUTCMonth()).to.eql(expected[1])
    expect(date.getUTCDate()).to.eql(expected[2])
  }

  function hms(expected) {
    const date = utils.flag(this, 'object')
    expect(date.getUTCHours()).to.eql(expected[0])
    expect(date.getUTCMinutes()).to.eql(expected[1])
    expect(date.getUTCSeconds()).to.eql(expected[2])
  }

  function uncertain(expected = true) {
    let neg = utils.flag(this, 'negate')
    let obj = utils.flag(this, 'object')

    if (neg) {
      if (obj.hasOwnProperty('uncertain')) {
        expect(X.is(obj.uncertain, expected)).to.be.eql(0)
      }
    } else {
      expect(obj)
        .to.have.property('uncertain')
        .and.satisfy(x => X.is(x, expected) !== 0)
    }
  }

  function approximate(expected = true) {
    let neg = utils.flag(this, 'negate')
    let obj = utils.flag(this, 'object')

    if (neg) {
      if (obj.hasOwnProperty('approximate')) {
        expect(X.is(obj.approximate, expected)).to.be.eql(0)
      }
    } else {
      expect(obj)
        .to.have.property('approximate')
        .and.satisfy(x => X.is(x, expected) !== 0)
    }
  }

  function unspecified(expected) {
    let neg = utils.flag(this, 'negate')
    let obj = utils.flag(this, 'object')

    if (neg) {
      if (obj.hasOwnProperty('unspecified')) {
        expect(X.is(obj.unspecified, expected)).to.be.eql(0)
      }
    } else {
      expect(obj)
        .to.have.property('unspecified')
        .and.satisfy(x => X.is(x, expected) !== 0)
    }
  }


  Assertion.addChainableMethod('year', year)
  Assertion.addChainableMethod('years', year)

  Assertion.addChainableMethod('month', months)
  Assertion.addChainableMethod('months', months)

  Assertion.addChainableMethod('day', days)
  Assertion.addChainableMethod('days', days)

  Assertion.addChainableMethod('hour', hours)
  Assertion.addChainableMethod('hours', hours)

  Assertion.addChainableMethod('minute', minutes)
  Assertion.addChainableMethod('minutes', minutes)

  Assertion.addChainableMethod('second', seconds)
  Assertion.addChainableMethod('seconds', seconds)

  Assertion.addChainableMethod('ms', ms)
  Assertion.addChainableMethod('milliseconds', ms)

  Assertion.addChainableMethod('time', time)
  Assertion.addChainableMethod('ymd', ymd)
  Assertion.addChainableMethod('hms', hms)

  Assertion.addChainableMethod('produce', function (expected) {
    const res = utils.flag(this, 'object')
    expect(res).to.have.property('values').and.eql(expected)
  })

  Assertion.addProperty('rejected', function () {
    expect(utils.flag(this, 'object')).to.throw('No possible parsings')
  })

  Assertion.addChainableMethod('uncertain', uncertain, uncertain)
  Assertion.addChainableMethod('approximate', approximate)
  Assertion.addChainableMethod('unspecified', unspecified)

  Assertion.addChainableMethod('level', function (expected) {
    expect(utils.flag(this, 'object'))
      .to.have.property('level', expected)
  })
})
