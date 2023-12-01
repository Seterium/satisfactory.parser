import { BaseCommand } from '@adonisjs/core/build/standalone'

import { FGManufacturerModel } from 'App/FGModels'

export default class FGManufacturersCommand extends BaseCommand {
  public static commandName = 'fg:manufacturers'

  public static description = ''

  public static settings = {
    loadApp: true,
  }

  public async run() {
    this.ui.sticker().add('Manufacturers').render()

    await FGManufacturerModel.parseDocsJson()
  }
}
