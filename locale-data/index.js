'use strict'

const locale = {}

locale.en = require('./en-US')
locale.de = require('./de-DE')
locale.fr = require('./fr-FR')

alias('en', 'AU', 'CA', 'GB', 'NZ', 'SA', 'US')
alias('de', 'AT', 'CH', 'DE')
alias('fr', 'CH', 'FR')

function alias(lc, ...args) {
  for (const ct of args) locale[`${lc}-${ct}`] = locale[lc]
}

module.exports = locale
