'use strict'

const edtf = require('../..')
const chai = require('chai')

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
})
