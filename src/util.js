'use strict'

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
  }
}

module.exports = util
