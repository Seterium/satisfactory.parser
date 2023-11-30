import fs from 'fs'

import Env from '@ioc:Adonis/Core/Env'

import { BaseCommand } from '@adonisjs/core/build/standalone'
import Locale from 'App/Models/Locale'
import consola from 'consola'
import chalk from 'chalk'

export default class FGLocalesCommand extends BaseCommand {
  public static commandName = 'fg:locales'

  public static description = ''

  public static settings = {
    loadApp: true,
  }

  public async run() {
    const localesDataRaw = fs.readFileSync(Env.get('FG_LOCALES_PATH')).toString()
    const localesData = JSON.parse(localesDataRaw)

    const localesKeyValues: Record<string, string> = localesData[Object.keys(localesData)[0]]

    const locales = Object.entries(localesKeyValues)

    for (const [key, value] of locales) {
      const model = new Locale()

      model.key = key
      model.value = value

      await model.save()

      consola.success(`Locale with key ${chalk.bold.cyanBright(key)} saved`)
    }
  }
}
