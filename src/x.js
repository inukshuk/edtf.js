'use strict'

class X {
  constructor(value = 0) {
    this.value = value
  }

  is(value = 0) {
    return this.value & X.convert(value)
  }


  set(value = 0) {
    return this.reset(this.value | value)
  }

  reset(value = 0) {
    return (this.value = X.convert(value)), this
  }

  static convert(value = 0) {
    value = value || 0

    switch (typeof value) {
      case 'number': return value

      case 'boolean': return value ? X.ymd : 0

      case 'string':
        if ((/^day/i).test(value)) return X.day
        if ((/^month/i).test(value)) return X.month
        if ((/^year/i).test(value)) return X.year

        if ((/^[yx]{4}[mx][mx][dx][dx]$/i).test(value)) {
          return value
            .split('')
            .reduce((memo, x, idx) =>
                (memo | (x === 'x' || x === 'X') ? Math.pow(2, idx) : 0), 0)
        }

        // fall through!

      default:
        throw new Error(`invalid value: ${value}`)
    }
  }
}


X.day   = X.d = X.convert('yyyymmxx')
X.month = X.m = X.convert('yyyyxxdd')
X.year  = X.y = X.convert('xxxxmmdd')

X.md  = X.m | X.d
X.ymd = X.y | X.md
X.ym  = X.y | X.m

X.yyxx = X.convert('yyxxmmdd')
X.yyyx = X.convert('yyyxmmdd')
X.xxxx = X.convert('xxxxmmdd')

module.exports = X
