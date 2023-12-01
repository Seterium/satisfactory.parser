import { BaseCommand } from '@adonisjs/core/build/standalone'

import { FGGeneratorModel } from 'App/FGModels'

export default class FGGeneratorsCommand extends BaseCommand {
  public static commandName = 'fg:generators'

  public static description = ''

  public static settings = {
    loadApp: true,
  }

  public async run() {
    this.ui.sticker().add('Generators').render()

    await FGGeneratorModel.parseDocsJson()
  }
}
