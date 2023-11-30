import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class FGTransportsCommand extends BaseCommand {
  public static commandName = 'fg:transports'

  public static description = ''

  public static settings = {
    loadApp: true,
  }

  public async run() {
    this.logger.info('Hello world!')
  }
}
