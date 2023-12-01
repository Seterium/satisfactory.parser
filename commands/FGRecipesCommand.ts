import { BaseCommand } from '@adonisjs/core/build/standalone'
import { FGRecipeModel } from 'App/FGModels'

export default class FGRecipesCommand extends BaseCommand {
  public static commandName = 'fg:recipes'

  public static description = ''

  public static settings = {
    loadApp: true,
  }

  public async run() {
    this.ui.sticker().add('Recipes').render()

    await FGRecipeModel.parseDocsJson()
  }
}
