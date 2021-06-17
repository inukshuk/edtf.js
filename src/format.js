import LC from '../locale-data/index.cjs'

const { assign } = Object

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


function getCacheId(...args) {
  let id = []

  for (let arg of args) {
    if (arg && typeof arg === 'object') {
      id.push(getOrderedProps(arg))
    } else {
      id.push(arg)
    }
  }

  return JSON.stringify(id)

}

function getOrderedProps(obj) {
  let props = []
  let keys = Object.getOwnPropertyNames(obj)

  for (let key of keys.sort()) {
    props.push({ [key]: obj[key] })
  }

  return props
}

export function getFormat(date, locale, options) {
  let opts = {}

  switch (date.precision) {
  case 3:
    opts.day = 'numeric'
    // eslint-disable-next-line no-fallthrough
  case 2:
    opts.month = 'numeric'
    // eslint-disable-next-line no-fallthrough
  case 1:
    opts.year = 'numeric'
    break
  }

  assign(opts, options, DEFAULTS[date.precision])

  let id = getCacheId(locale, opts)

  if (!format.cache.has(id)) {
    format.cache.set(id, new Intl.DateTimeFormat(locale, opts))
  }

  return format.cache.get(id)
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

function mask(date, parts) {
  let string = ''

  for (let { type, value } of parts) {
    string += (isDMY(type) && date.unspecified.is(type)) ?
      value.replace(/./g, 'X') :
      value
  }

  return string
}

export function format(date, locale = 'en-US', options = {}) {
  const fmt = getFormat(date, locale, options)
  const pat = getPatternsFor(fmt)

  if (!date.isEDTF || pat == null) {
    return fmt.format(date)
  }

  let string = (!date.unspecified.value || !fmt.formatToParts) ?
    fmt.format(date) :
    mask(date, fmt.formatToParts(date))


  if (date.approximate.value) {
    string = pat.approximate.replace('%D', string)
  }

  if (date.uncertain.value) {
    string = pat.uncertain.replace('%D', string)
  }

  return string
}

format.cache = new Map()
