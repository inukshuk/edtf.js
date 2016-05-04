'use strict'

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
    return data => args.reduce((a, i) => Object.assign(a, data[i]), {})
  }
}

module.exports = util
