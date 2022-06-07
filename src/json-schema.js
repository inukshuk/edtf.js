// see https://rawgit.com/zaggino/z-schema/master/benchmark/results.html for a list of schema engines

import { parse } from './parser.js'

function validate(date, level, seasonIntervals) {
  if (typeof date !== 'string') return false

  try {
    parse(date, { level, seasonIntervals })
    return true
  } catch (err) {
    return false
  }
}

export const formats = {}
for (const _seasonIntervals of [false, true]) {
  for (const _level of [0, 1, 2]) {
    ((level, seasonIntervals) => {
      const fmt = `edtf/${level}${seasonIntervals ? '+season-intervals' : ''}`
      formats[fmt] = date => validate(date, { level, seasonIntervals })
    })(_level, _seasonIntervals)
  }
}

export function ajv(_ajv) {
  for (const [format, validator] of Object.entries(formats)) {
    _ajv.addFormat(format, validator)
  }
  return _ajv
}

export function zschema(_zschema) {
  for (const [format, validator] of Object.entries(formats)) {
    _zschema.registerFormat(format, function (date) {
      return validator(date)
    })
  }
  return _zschema
}
