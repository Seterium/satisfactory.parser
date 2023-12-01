import { BaseCommand } from '@adonisjs/core/build/standalone'

import { FGExtractorModel } from 'App/FGModels'

export default class FGExtractorsCommand extends BaseCommand {
  public static commandName = 'fg:extractors'

  public static description = ''

  public static settings = {
    loadApp: true,
  }

  public async run() {
    this.ui.sticker().add('Extractors').render()

    await FGExtractorModel.parseDocsJson()
  }
}
