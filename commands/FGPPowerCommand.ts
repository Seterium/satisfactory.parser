import { BaseCommand } from '@adonisjs/core/build/standalone'
import PowerPlanner from 'App/Services/PowerPlanner'

export default class FGPPower extends BaseCommand {
  public static commandName = 'fgp:power'

  public static description = ''

  public static settings = {
    loadApp: true,
  }

  public async run() {
    const generator = new PowerPlanner()

    await generator.generate()
  }
}
