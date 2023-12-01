import { FGAbstractModel, FGBlueprintModel } from 'App/FGModels'

import Manufacturer from 'App/Models/Manufacturer'
import Recipe from 'App/Models/Recipe'

import chalk from 'chalk'
import consola from 'consola'

const RECIPES_CLASSES_MAP = {
  FoundryMk1: 'SmelterMk1',
}

export class FGManufacturerModel extends FGAbstractModel {
  recipesJsonData: Record<string, any>[]

  buildFModelData: Record<string, any>[]

  constructor(
    manufacturerJsonData: Record<string, any>,
    recipesJsonData: Record<string, any>[],
  ) {
    super(manufacturerJsonData)

    this.recipesJsonData = recipesJsonData
    this.buildFModelData = this.getFModelBuildDesc()
  }

  protected get nameLocaleKey() {
    const buildDescWithDisplayNameProperty = this.buildFModelData.find((buildDesc) => {
      const type = `Build_${this.cleanedClassName}_C`

      return buildDesc?.Type === type
        && buildDesc?.Name === `Default__${type}`
        && buildDesc?.Properties?.mDisplayName?.Key
    })

    if (buildDescWithDisplayNameProperty === undefined) {
      throw new Error(`Could not find power value for ${this.cleanedClassName}`)
    }

    return buildDescWithDisplayNameProperty.Properties.mDisplayName.Key
  }

  protected get cleanedClassName() {
    return this.unsuffixedClassName.substring(6)
  }

  private get powerConsumption() {
    return parseInt(this.docsJsonData.mPowerConsumption ?? '0', 10)
  }

  private async saveBlueprint() {
    const blueprintClass = RECIPES_CLASSES_MAP[this.cleanedClassName] ?? this.cleanedClassName

    const blueprintJsonData = this.recipesJsonData.find(({ ClassName }) => ClassName === `Recipe_${blueprintClass}_C`)

    if (blueprintJsonData === undefined) {
      throw new Error(`Could not find recipe for ${this.docsJsonData.ClassName}`)
    }

    const blueprintModel = new FGBlueprintModel(blueprintJsonData)

    const blueprintId = await blueprintModel.save()

    return blueprintId
  }

  async save() {
    const model = new Manufacturer()

    model.class = this.docsJsonData.ClassName
    model.nameLocaleKey = this.nameLocaleKey
    model.blueprintId = await this.saveBlueprint()
    model.powerConsumption = this.powerConsumption
    model.powerExponent = this.docsJsonData.mPowerConsumptionExponent
    model.icon = this.icon

    await model.save()

    consola.success(`Manufacturer ${chalk.bold.cyanBright(this.docsJsonData.ClassName)} saved`)
  }

  static async parseDocsJson() {
    const manufacturersJsonData = this.getDocsJsonDescriptors([
      'FGBuildableManufacturer',
      'FGBuildableManufacturerVariablePower',
    ])

    const recipesJsonData = FGManufacturerModel.getDocsJsonDescriptors([
      'FGRecipe',
    ])

    await FGManufacturerModel.truncate(Manufacturer)
    await FGAbstractModel.truncate(Recipe)

    for (const manufacturerJsonData of manufacturersJsonData) {
      const model = new this(manufacturerJsonData, recipesJsonData)

      await model.save()
    }
  }
}
