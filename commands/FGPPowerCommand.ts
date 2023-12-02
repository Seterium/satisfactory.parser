import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class FGPPower extends BaseCommand {
  public static commandName = 'fgp:power'

  public static description = ''

  public static settings = {
    loadApp: true,
  }

  public async run() {
    this.logger.info('Hello world!')
  }
}
