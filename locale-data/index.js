import { readFileSync } from 'fs'

const load = (locale) =>
  JSON.parse(readFileSync(new URL(`${locale}.json`, import.meta.url)))

const alias = (lang, ...regions) => {
  for (let region of regions)
    data[`${lang}-${region}`] = data[lang]
}

const data = {
  en: load('en-US'),
  es: load('es-ES'),
  de: load('de-DE'),
  fr: load('fr-FR'),
  it: load('it-IT'),
  ja: load('ja-JA')
}

alias('en', 'AU', 'CA', 'GB', 'NZ', 'SA', 'US')
alias('de', 'AT', 'CH', 'DE')
alias('fr', 'CH', 'FR')

export default data
