import { BaseCommand } from '@adonisjs/core/build/standalone'

import Locale from 'App/Models/Locale'

import chalk from 'chalk'
import consola from 'consola'
import { getLocalesDictionary } from 'App/Utils'

export default class FGLocalesCommand extends BaseCommand {
  public static commandName = 'fg:locales'

  public static description = ''

  public static settings = {
    loadApp: true,
  }

  public async run() {
    this.ui.sticker().add('Locales').render()

    const dictionary = getLocalesDictionary()

    const locales = await Locale.all()

    for (const locale of locales) {
      if (locale.key) {
        const localeValue: string | undefined = dictionary[locale.key]

        if (localeValue) {
          locale.value = localeValue

          await locale.save()

          consola.success(`Locale ${chalk.bold.cyanBright(locale.key)} value saved`)
        }
      }
    }
  }
}
