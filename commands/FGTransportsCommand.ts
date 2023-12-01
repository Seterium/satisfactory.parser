import { BaseCommand } from '@adonisjs/core/build/standalone'

import { FGTransportModel } from 'App/FGModels'

export default class FGTransportsCommand extends BaseCommand {
  public static commandName = 'fg:transports'

  public static description = ''

  public static settings = {
    loadApp: true,
  }

  public async run() {
    this.ui.sticker().add('Transports').render()

    await FGTransportModel.parseDocsJson()
  }
}
