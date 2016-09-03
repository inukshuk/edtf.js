'use strict'

const { assign } = Object

function format(date, locale, options = {}) {
  const defaults = {}

  switch (date.precision) {
  case 3:
    if (options.weekday) defaults.weekday = options.weekday
    else defaults.day = options.day || 'numeric'

    // eslint-disable-next-line no-fallthrough

  case 2:
    defaults.month = options.month || 'numeric'

    // eslint-disable-next-line no-fallthrough

  case 1:
    defaults.year = options.year || 'numeric'

    defaults.hour = undefined
    defaults.minute = undefined
    defaults.second = undefined
    defaults.timeZoneName = undefined

    break
  }

  return new Intl.DateTimeFormat(locale, assign({}, options, defaults))
}

module.exports = {
  format
}
