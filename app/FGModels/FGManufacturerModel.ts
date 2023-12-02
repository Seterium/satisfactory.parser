import { FGAbstractModel } from 'App/FGModels'

import Manufacturer from 'App/Models/Manufacturer'
import Recipe from 'App/Models/Recipe'

import chalk from 'chalk'
import consola from 'consola'

export class FGManufacturerModel extends FGAbstractModel {
  private get powerConsumption() {
    return parseInt(this.buildJsonData.mPowerConsumption ?? '0', 10)
  }

  async save() {
    const model = new Manufacturer()

    model.class = this.cleanedClassName
    model.nameLocaleId = await this.saveLocale(this.buildNameLocale)
    model.blueprintId = await this.saveBlueprint()
    model.powerConsumption = this.powerConsumption
    model.powerExponent = this.buildJsonData.mPowerConsumptionExponent
    model.icon = this.icon

    await model.save()

    consola.success(`Manufacturer ${chalk.bold.cyanBright(this.cleanedClassName)} saved`)
  }

  static async parseDocsJson() {
    const manufacturersJsonData = this.getDocsJsonDescriptors([
      'FGBuildableManufacturer',
      'FGBuildableManufacturerVariablePower',
    ])

    await FGManufacturerModel.truncate(Manufacturer)
    await FGAbstractModel.truncate(Recipe)

    for (const manufacturerJsonData of manufacturersJsonData) {
      const model = new this(manufacturerJsonData, 'build', {
        loadRecipeJsonData: true,
        loadDescJsonData: true,
        loadDescFModelData: true,
      })

      await model.save()
    }
  }
}
