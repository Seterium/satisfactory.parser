import { BaseCommand } from '@adonisjs/core/build/standalone'

import { FGComponentModel } from 'App/FGModels'

export default class FGComponentsCommand extends BaseCommand {
  public static commandName = 'fg:components'

  public static description = ''

  public static settings = {
    loadApp: true,
  }

  public async run() {
    await FGComponentModel.parseDocsJson()
  }
}
