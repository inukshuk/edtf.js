'use strict'

const { assign } = Object
const LC = require('../locale-data')

const noTime = {
  timeZone: 'UTC',
  timeZoneName: undefined,
  hour: undefined,
  minute: undefined,
  second: undefined
}

const DEFAULTS = [
  {},
  assign({ weekday: undefined, day: undefined, month: undefined }, noTime),
  assign({ weekday: undefined, day: undefined }, noTime),
  assign({}, noTime),
]

function getFormat(date, locale, options) {
  const defaults = {}

  switch (date.precision) {
  case 3:
    defaults.day = 'numeric'
    // eslint-disable-next-line no-fallthrough
  case 2:
    defaults.month = 'numeric'
    // eslint-disable-next-line no-fallthrough
  case 1:
    defaults.year = 'numeric'
    break
  }

  return new Intl.DateTimeFormat(
    locale,
    assign(defaults, options, DEFAULTS[date.precision])
  )
}

function getPatternsFor(fmt) {
  const { locale, weekday, month, year } = fmt.resolvedOptions()
  const lc = LC[locale]

  if (lc == null) return null

  const variant = (weekday || month === 'long') ? 'long' :
    (!month || year === '2-digit') ? 'short' : 'medium'

  return {
    approximate: lc.date.approximate[variant],
    uncertain: lc.date.uncertain[variant]
  }
}

function isDMY(type) {
  return type === 'day' || type === 'month' || type === 'year'
}

function format(date, locale = 'en-US', options = {}) {
  const fmt = getFormat(date, locale, options)
  const pat = getPatternsFor(fmt)

  if (!date.isEDTF || pat == null) {
    return fmt.format(date)
  }

  let string = ''

  if (date.unspecified.value && typeof fmt.formatToParts === 'function') {
    for (let { type, value } of fmt.formatToParts(date)) {
      string += (isDMY(type) && date.unspecified.is(type)) ?
        value.replace(/./g, 'X') :
        value
    }

  } else {
    string = fmt.format(date)
  }

  if (date.approximate.value) {
    string = pat.approximate.replace('%D', string)
  }

  if (date.uncertain.value) {
    string = pat.uncertain.replace('%D', string)
  }

  return string
}


module.exports = {
  getFormat,
  format
}
