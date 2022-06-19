import en from './en-US.json' assert { type: 'json' }
import es from './es-ES.json' assert { type: 'json' }
import de from './de-DE.json' assert { type: 'json' }
import fr from './fr-FR.json' assert { type: 'json' }
import it from './it-IT.json' assert { type: 'json' }
import ja from './ja-JA.json' assert { type: 'json' }

const alias = (lang, ...regions) => {
  for (let region of regions)
    data[`${lang}-${region}`] = data[lang]
}

const data = {
  en, 
  es,
  de,
  fr,
  it,
  ja
}

alias('en', 'AU', 'CA', 'GB', 'NZ', 'SA', 'US')
alias('de', 'AT', 'CH', 'DE')
alias('fr', 'CH', 'FR')

export default data
