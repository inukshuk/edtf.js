import LC from '../locale-data/index.cjs'

const { assign } = Object

const OPTS = [
  {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    timeZoneName: undefined,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  },
  {
    year: 'numeric',
    timeZone: 'UTC',
    timeZoneName: undefined
  },
  {
    month: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
    timeZoneName: undefined
  },
  {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
    timeZoneName: undefined
  }
]

const CONS = [
  {},
  {
    month: undefined,
    day: undefined,
    weekday: undefined,
    hour: undefined,
    minute: undefined,
    second: undefined
  },
  {
    day: undefined,
    weekday: undefined,
    hour: undefined,
    minute: undefined,
    second: undefined
  },
  {
    hour: undefined,
    minute: undefined,
    second: undefined
  }
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
  let opts = assign(
    {},
    OPTS[date.precision],
    options,
    CONS[date.precision]
  )

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

// eslint-disable-next-line complexity
export function format(date, locale = 'en-US', options = {}) {
  if (date.timeZone && !options.timeZone) {
    options = {
      timeZoneName: 'short',
      ...options,
      timeZone: date.timeZone
    }
  }

  const fmt = getFormat(date, locale, options)
  const pat = getPatternsFor(fmt)

  if (!date.isEDTF || pat == null) {
    return fmt.format(date)
  }

  if (date.type === 'Interval') {
    if (date.finite) {
      return fmt.formatRange(date.lower, date.upper)
    } else {
      throw new Error('cannot format infinite intervals')
    }
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
