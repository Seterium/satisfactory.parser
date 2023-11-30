import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class FGRecipesCommand extends BaseCommand {
  public static commandName = 'fg:recipes'

  public static description = ''

  public static settings = {
    loadApp: true,
  }

  public async run() {
    this.logger.info('Hello world!')
  }
}
