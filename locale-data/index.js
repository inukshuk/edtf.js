import en from './en-US.json' with { type: 'json' }
import es from './es-ES.json' with { type: 'json' }
import de from './de-DE.json' with { type: 'json' }
import fr from './fr-FR.json' with { type: 'json' }
import it from './it-IT.json' with { type: 'json' }
import ja from './ja-JA.json' with { type: 'json' }

const data = { en, es, de, fr, it, ja }

const alias = (lang, ...regions) => {
  for (let region of regions)
    data[`${lang}-${region}`] = data[lang]
}

alias('en', 'AU', 'CA', 'GB', 'NZ', 'SA', 'US')
alias('de', 'AT', 'CH', 'DE')
alias('fr', 'CH', 'FR')

export default data
