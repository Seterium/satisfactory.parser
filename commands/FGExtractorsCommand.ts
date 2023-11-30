import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class FGExtractorsCommand extends BaseCommand {
  public static commandName = 'fg:extractors'

  public static description = ''

  public static settings = {
    loadApp: true,
  }

  public async run() {
    this.logger.info('Hello world!')
  }
}
