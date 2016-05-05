'use strict'

const Bitmask = require('./bitmask')
const { assign } = Object

const util = {

  num(data) {
    return Number(Array.isArray(data) ? data.join('') : data)
  },

  join(data) {
    return data.join('')
  },

  zero() { return 0 },

  pick(...args) {
    return args.length === 1 ?
      data => data[args[0]] :
      data => util.concat(data, args)
  },

  pluck(...args) {
    return data => args.map(i => data[i])
  },

  concat(data, idx = data.keys()) {
    return Array.from(idx)
      .reduce((memo, i) => data[i] !== null ? memo.concat(data[i]) : memo, [])
  },

  merge(...args) {
    if (typeof args[args.length - 1] === 'object') {
      var extra = args.pop()
    }

    return data => assign(args.reduce((a, i) => assign(a, data[i]), {}), extra)
  },

  interval(level) {
    return data => ({
      values: [data[0], data[2]],
      type: 'interval',
      level
    })
  },

  masked(type = 'unspecified', symbol = 'X') {
    return (data, _, reject) => {
      let mask = data.join('').replace(/-/g, '')

      return mask.indexOf(symbol) === -1 ? reject : {
        values: Bitmask.values(mask),
        [type]: Bitmask.compute(mask)
      }
    }
  },

  date(values, level = 0) {
    return {
      type: 'date',
      level,
      values: Bitmask.normalize(values.map(Number))
    }
  },

  datetime(data) {
    return {
      values: data[0].values.concat(data[2]),
      offset: data[3],
      type: 'datetime',
      level: 0
    }
  },

  season(data, level = 1) {
    return {
      type: 'season',
      level,
      values: [Number(data[0]), Number(data[2])]
    }
  },

  qualify([parts], _, reject) {
    console.log(parts)

    let q = {
      uncertain: new Bitmask(), approximate: new Bitmask()
    }

    let values = parts
      .map(([lhs, part, rhs], idx) => {
        for (let ua in lhs) q[ua].qualify(idx * 2)
        for (let ua in rhs) q[ua].qualify(1 + idx * 2)
        return part
      })

    return (!q.uncertain.value && !q.approximate.value) ?
      reject :
      assign(util.date(values, 2), {
        uncertain: q.uncertain.value,
        approximate: q.approximate.value
      })
  }

}

module.exports = util
