import { FGAbstractModel, FGBlueprintModel } from 'App/FGModels'
import Transport from 'App/Models/Transport'
import chalk from 'chalk'
import consola from 'consola'

const FLUID_RATE_LIMIT_FACTOR = 60
export class FGTransportModel extends FGAbstractModel {
  private recipesJsonData: Record<string, string>[] = []

  private buildFModelData: Record<string, any>[]

  constructor(transportJsonData: Record<string, string>, recipesJsonData: Record<string, string>[]) {
    super(transportJsonData)

    this.buildFModelData = this.getFModelBuildDesc()
    this.recipesJsonData = recipesJsonData
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

  // protected get icon() {
  //   const iconPath = this.buildFModelData.find((data) => {
  //     return data.Properties?.mPersistentBigIcon?.ObjectPath
  //   })?.Properties?.mPersistentBigIcon?.ObjectPath

  //   if (typeof iconPath !== 'string') {
  //     throw new Error(`Could not find icon for ${this.cleanedClassName}`)
  //   }

  //   return iconPath.replace('.0', '')
  // }

  private get speed() {
    if (this.docsJsonData.mSpeed) {
      return parseInt(this.docsJsonData.mSpeed, 10) / 2
    }

    return parseInt(this.docsJsonData.mFlowLimit, 10) * FLUID_RATE_LIMIT_FACTOR
  }

  async saveBlueprint() {
    const blueprintJsonData = this.recipesJsonData.find(({ ClassName }) => {
      return ClassName === `Recipe_${this.cleanedClassName}_C`
    })

    if (blueprintJsonData === undefined) {
      throw new Error(`Could not find blueprint for ${this.docsJsonData.ClassName} (Recipe_${this.cleanedClassName})`)
    }

    const blueprintModel = new FGBlueprintModel(blueprintJsonData)

    const blueprintId = await blueprintModel.save()

    return blueprintId
  }

  async save() {
    const model = new Transport()

    const blueprintId = await this.saveBlueprint()

    model.class = this.docsJsonData.ClassName
    model.nameLocaleKey = this.nameLocaleKey
    model.blueprintId = blueprintId
    model.icon = this.icon
    model.speed = this.speed

    await model.save()

    consola.success(`Transport ${chalk.bold.cyanBright(this.docsJsonData.ClassName)} saved`)
  }

  static async parseDocsJson() {
    const transportsJsonList = this.getDocsJsonDescriptors([
      'FGBuildableConveyorBelt',
      'FGBuildablePipeline',
    ]).filter(({ ClassName }) => ClassName.includes('NoIndicator') === false)

    const recipesJsonList = this.getDocsJsonDescriptors([
      'FGRecipe',
    ])

    for (const jsonData of transportsJsonList) {
      const model = new this(jsonData, recipesJsonList)

      await model.save()
    }
  }
}
