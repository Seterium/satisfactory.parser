import { FGAbstractModel, FGBlueprintModel } from 'App/FGModels'

import Extractor from 'App/Models/Extractor'

import chalk from 'chalk'
import consola from 'consola'

export class FGExtractorModel extends FGAbstractModel {
  private extractorJsonData: Record<string, any>

  private fmodelDesc: Record<string, any>[]

  private buildingFModelData: Record<string, any>[]

  private recipesJsonData: Record<string, any>[]

  private skip: boolean = false

  constructor(
    buildingJsonData: Record<string, any>,
    extractorsJsonData: Record<string, any>[],
    recipesJsonData: Record<string, any>[],
  ) {
    super(buildingJsonData, false)

    const extractorJsonData = this.getExtractorJsonData(extractorsJsonData)

    if (extractorJsonData) {
      this.extractorJsonData = extractorJsonData
      this.recipesJsonData = recipesJsonData
      this.fmodelDesc = this.getFModelDesc()
      this.buildingFModelData = this.getFModelBuildDesc()
    } else {
      this.skip = true
    }
  }

  protected get icon() {
    const iconPath = this.fmodelDesc[1].Properties?.mPersistentBigIcon?.ObjectPath

    if (typeof iconPath !== 'string') {
      throw new Error(`Could not find icon for ${this.cleanedClassName}`)
    }

    return iconPath.replace('.0', '')
  }

  protected get nameLocaleKey() {
    const buildDescWithDisplayNameProperty = this.buildingFModelData.find((buildDesc) => {
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

  private get powerConsumption() {
    return parseInt(this.extractorJsonData.mPowerConsumption ?? '0', 10)
  }

  private get extractionFactor() {
    return parseFloat(this.extractorJsonData.mExtractCycleTime ?? '0')
      / parseInt(this.extractorJsonData.mItemsPerCycle?.[0] ?? '1', 10)
  }

  private getExtractorJsonData(extractorsJsonData: Record<string, any>[]) {
    return extractorsJsonData.find(({ ClassName }) => {
      return ClassName === `Build_${this.cleanedClassName}_C`
    })
  }

  private async saveBlueprint() {
    const blueprintJsonData = this.recipesJsonData.find(({ ClassName }) => ClassName === `Recipe_${this.cleanedClassName}_C`)

    if (blueprintJsonData === undefined) {
      throw new Error(`Could not find recipe for ${this.docsJsonData.ClassName}`)
    }

    const blueprintModel = new FGBlueprintModel(blueprintJsonData)

    const blueprintId = await blueprintModel.save()

    return blueprintId
  }

  async save() {
    if (this.skip) {
      return
    }

    const blueprintId = await this.saveBlueprint()

    const model = new Extractor()

    model.class = this.docsJsonData.ClassName
    model.nameLocaleKey = this.nameLocaleKey
    model.icon = this.icon
    model.blueprintId = blueprintId
    model.powerConsumption = this.powerConsumption
    model.powerExponent = this.extractorJsonData.mPowerConsumptionExponent
    model.extractionFactor = this.extractionFactor

    await model.save()

    consola.success(`Extractor ${chalk.bold.cyanBright(this.docsJsonData.ClassName)} saved`)
  }

  static async parseDocsJson() {
    const extractorsJsonData = this.getDocsJsonDescriptors([
      'FGBuildableResourceExtractor',
      'FGBuildableWaterPump',
      'FGBuildableFrackingExtractor',
      'FGBuildableFrackingActivator',
    ])

    const buildingsJsonData = this.getDocsJsonDescriptors([
      'FGBuildingDescriptor',
    ])

    const recipesJsonData = FGExtractorModel.getDocsJsonDescriptors([
      'FGRecipe',
    ])

    FGExtractorModel.truncate(Extractor)

    for (const buildingJsonData of buildingsJsonData) {
      const model = new this(buildingJsonData, extractorsJsonData, recipesJsonData)

      await model.save()
    }
  }
}
