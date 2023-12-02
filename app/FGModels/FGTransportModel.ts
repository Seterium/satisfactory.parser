import { FGAbstractModel } from 'App/FGModels'

import Transport from 'App/Models/Transport'

import chalk from 'chalk'
import consola from 'consola'

const FLUID_RATE_LIMIT_FACTOR = 60
export class FGTransportModel extends FGAbstractModel {
  private get speed() {
    if (this.buildJsonData.mSpeed) {
      return parseInt(this.buildJsonData.mSpeed, 10) / 2
    }

    return parseInt(this.buildJsonData.mFlowLimit, 10) * FLUID_RATE_LIMIT_FACTOR
  }

  async save() {
    const model = new Transport()

    const blueprintId = await this.saveBlueprint()

    model.class = this.className
    model.nameLocaleId = await this.saveLocale(this.buildNameLocale)
    model.blueprintId = blueprintId
    model.icon = this.icon
    model.speed = this.speed

    await model.save()

    consola.success(`Transport ${chalk.bold.cyanBright(this.className)} saved`)
  }

  static async parseDocsJson() {
    const transportsJsonList = this.getDocsJsonDescriptors([
      'FGBuildableConveyorBelt',
      'FGBuildablePipeline',
    ]).filter(({ ClassName }) => ClassName.includes('NoIndicator') === false)

    for (const jsonData of transportsJsonList) {
      const model = new this(jsonData, 'build', {
        loadDescFModelData: true,
        loadRecipeJsonData: true,
      })

      await model.save()
    }
  }
}
