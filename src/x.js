'use strict'

class X {
  constructor(value = 0) {
    this.value = value
  }

  unspecified(query = 0) {
    return this.value & this.convert(query)
  }

  convert(value = 0) {
    switch (typeof value) {
      case 'number': return value

      case 'string':
        if ((/^day/).test(value)) return X.day
        if ((/^month/).test(value)) return X.month
        if ((/^year/).test(value)) return X.year
        // fall through!

      default:
        throw new Error(`invalid value: ${value}`)
    }
  }
}


X.day   = X.d = 0x00000011
X.month = X.m = 0x00001100
X.year  = X.y = 0x11110000

X.md  = X.m | X.d
X.ymd = X.y | X.md
X.ym  = X.y | X.m

X.yyxx = 0x00110000
X.yyyx = 0x00010000
X.xxxx = 0x11110000

module.exports = X
