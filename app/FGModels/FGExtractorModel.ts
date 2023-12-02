import { FGAbstractModel } from 'App/FGModels'

import Extractor from 'App/Models/Extractor'

import chalk from 'chalk'
import consola from 'consola'

export class FGExtractorModel extends FGAbstractModel {
  private get powerConsumption() {
    return parseInt(this.buildJsonData.mPowerConsumption ?? '0', 10)
  }

  private get extractionFactor() {
    return parseFloat(this.buildJsonData.mExtractCycleTime ?? '0')
      / parseInt(this.buildJsonData.mItemsPerCycle?.[0] ?? '1', 10)
  }

  async save() {
    const model = new Extractor()

    const blueprintId = await this.saveBlueprint()

    model.class = this.className
    model.nameLocaleKey = this.buildNameLocale
    model.icon = this.icon
    model.blueprintId = blueprintId
    model.powerConsumption = this.powerConsumption
    model.powerExponent = this.buildJsonData.mPowerConsumptionExponent
    model.extractionFactor = this.extractionFactor

    await model.save()

    consola.success(`Extractor ${chalk.bold.cyanBright(this.className)} saved`)
  }

  static async parseDocsJson() {
    const extractorsJsonData = this.getDocsJsonDescriptors([
      'FGBuildableResourceExtractor',
      'FGBuildableWaterPump',
      'FGBuildableFrackingExtractor',
      'FGBuildableFrackingActivator',
    ])

    FGExtractorModel.truncate(Extractor)

    for (const extractorJsonData of extractorsJsonData) {
      const model = new this(extractorJsonData, 'build', {
        loadRecipeJsonData: true,
        loadDescFModelData: true,
      })

      await model.save()
    }
  }
}
