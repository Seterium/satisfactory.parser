import { BaseCommand } from '@adonisjs/core/build/standalone'

import {
  FGComponentModel,
  FGManufacturerModel,
  FGRecipeModel,
  FGGeneratorModel,
  FGTransportModel,
  FGExtractorModel,
} from 'App/FGModels'

import consola from 'consola'
import { execPromise } from 'App/Utils'

export default class FGAllCommand extends BaseCommand {
  public static commandName = 'fg:all'

  public static description = ''

  public static settings = {
    loadApp: true,
  }

  private async dbWipe() {
    consola.start('Dabase wipe ...')

    await execPromise('node ace db:wipe')

    consola.success('Dabase wiped successfully')
  }

  private async migrationRun() {
    consola.start('Migrations apply ...')

    await execPromise('node ace migration:run')

    consola.success('Migrations applied successfully')
  }

  public async run() {
    await this.dbWipe()
    await this.migrationRun()

    this.ui.sticker().add('Components').render()
    await FGComponentModel.parseDocsJson()

    this.ui.sticker().add('Manufacturers').render()
    await FGManufacturerModel.parseDocsJson()

    this.ui.sticker().add('Recipes').render()
    await FGRecipeModel.parseDocsJson()

    this.ui.sticker().add('Generators').render()
    await FGGeneratorModel.parseDocsJson()

    this.ui.sticker().add('Transports').render()
    await FGTransportModel.parseDocsJson()

    this.ui.sticker().add('Extractors').render()
    await FGExtractorModel.parseDocsJson()
  }
}
