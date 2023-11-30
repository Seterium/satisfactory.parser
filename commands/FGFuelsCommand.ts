import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class FGFuelsCommand extends BaseCommand {
  public static commandName = 'fg:fuels'

  public static description = ''

  public static settings = {
    loadApp: true,
  }

  public async run() {
    this.logger.info('Hello world!')
  }
}
