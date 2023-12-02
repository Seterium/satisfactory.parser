import fs from 'fs'

import Env from '@ioc:Adonis/Core/Env'

export function getLocalesDictionary() {
  const localesData = JSON.parse(
    fs.readFileSync(Env.get('FG_LOCALES_PATH')).toString(),
  )

  return Object.values<Record<string, string>>(localesData)[0]
}
