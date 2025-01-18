import nearley from 'nearley'
import grammar from './grammar.js'

export const defaults = {
  level: 2,
  types: [],
  seasonIntervals: false,
  seasonUncertainty: false
}

function byLevel(a, b) {
  return a.level < b.level ? -1 : a.level > b.level ? 1 : 0
}

function limit(results, constraints = {}) {
  if (!results.length) return results

  let {
    level,
    types,
    seasonIntervals,
    seasonUncertainty
  } = { ...defaults, ...constraints }


  return results.filter(res => {
    if (seasonIntervals && isSeasonInterval(res))
      return true
    if (seasonUncertainty && isSeasonLevel3(res))
      return true

    if (res.level > level)
      return false
    if (types.length && !types.includes(res.type))
      return false

    return true
  })
}

function isSeasonInterval({ type, values }) {
  return type === 'Interval' && values[0].type === 'Season'
}
function isSeasonLevel3({ type, level }) {
  return type === 'Season' && level >= 3
}

function best(results) {
  if (results.length < 2) return results[0]

  // If there are multiple results, pick the first
  // one on the lowest level!
  return results.sort(byLevel)[0]
}

export function parse(input, constraints = {}) {
  try {
    let nep = parser()
    let res = best(limit(nep.feed(input).results, constraints))

    if (!res) throw new Error('edtf: No possible parsings (@EOS)')

    return res

  } catch (error) {
    error.message += ` for "${input}"`
    throw error
  }
}

export function parser() {
  return new nearley.Parser(grammar.ParserRules, grammar.ParserStart)
}
