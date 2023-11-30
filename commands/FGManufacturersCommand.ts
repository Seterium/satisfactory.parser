import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class FGManufacturersCommand extends BaseCommand {
  public static commandName = 'fg:manufacturers'

  public static description = ''

  public static settings = {
    loadApp: true,
  }

  public async run() {
    this.logger.info('Hello world!')
  }
}
