'use strict'

const { assign } = Object

const noTime = {
  timeZoneName: undefined,
  hour: undefined,
  minute: undefined,
  second: undefined
}

const DEFAULTS = [
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


function format(date, locale = 'en', options = {}) {
  const fmt = getFormat(date, locale, options)

  if (typeof fmt.formatToParts !== 'function') {
    return fmt.format(date)
  }

  return fmt.format(date)
}


module.exports = {
  getFormat,
  format
}
