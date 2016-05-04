'use strict'

const Bitmask = require('./bitmask')
const { assign } = Object

const util = {

  num(data) { return Number(data.join('')) },

  join(data) {
    return data.join('')
  },

  zero() { return 0 },

  pick(...args) {
    return args.length === 1 ?
      data => data[args[0]] :
      data => util.concat(data, args)
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
  }
}

module.exports = util
