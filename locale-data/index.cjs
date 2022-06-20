const en = require('./en-US.json')
const es = require('./es-ES.json')
const de = require('./de-DE.json')
const fr = require('./fr-FR.json')
const it = require('./it-IT.json')
const ja = require('./ja-JA.json')

const alias = (lang, ...regions) => {
  for (let region of regions)
    data[`${lang}-${region}`] = data[lang]
}

const data = { en, es, de, fr, it, ja }

alias('en', 'AU', 'CA', 'GB', 'NZ', 'SA', 'US')
alias('de', 'AT', 'CH', 'DE')
alias('fr', 'CH', 'FR')

module.exports = data
