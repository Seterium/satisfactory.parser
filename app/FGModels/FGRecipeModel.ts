import { FGAbstractModel } from 'App/FGModels'
import Component from 'App/Models/Component'

import Recipe from 'App/Models/Recipe'
import RecipeInput from 'App/Models/RecipeInput'
import RecipeOutput from 'App/Models/RecipeOutput'

import chalk from 'chalk'
import consola from 'consola'
import { trim } from 'lodash'
import { parseRecipeString } from 'App/Utils'
import Manufacturer from 'App/Models/Manufacturer'

const EXCLUDED_MANUFACTURERS = [
  'BP_BuildGun_C',
  'FGBuildGun',
  'FGBuildableAutomatedWorkBench',
  'BP_WorkshopComponent_C',
  'BP_WorkBenchComponent_C',
  'Build_AutomatedWorkBench_C',
]

export class FGRecipeModel extends FGAbstractModel {
  private recipeFModelData: Record<string, any>[]

  private skip: boolean = false

  constructor(recipeJsonData: Record<string, any>) {
    super(recipeJsonData, false)

    if (this.manufacturerClassName === '' || EXCLUDED_MANUFACTURERS.includes(this.manufacturerClassName)) {
      this.skip = true
    } else {
      this.recipeFModelData = this.getFModelRecipeDesc()
    }
  }

  protected get nameLocaleKey() {
    if (this.isAlt === false) {
      return ''
    }

    const recipeDataWithDisplayNameProperty = this.recipeFModelData.find((recipeData) => {
      const type = `Recipe_${this.cleanedClassName}_C`

      return recipeData?.Type === type
        && recipeData?.Properties?.mDisplayName?.Key
    })

    if (recipeDataWithDisplayNameProperty === undefined) {
      throw new Error(`Could not find mDisplayName prop in ${this.docsJsonData.ClassName} FModel desc`)
    }

    return recipeDataWithDisplayNameProperty.Properties.mDisplayName.Key
  }

  private get inputResources() {
    return parseRecipeString(this.docsJsonData.mIngredients)
  }

  private get outputProducts() {
    return parseRecipeString(this.docsJsonData.mProduct)
  }

  private get powerConsumption() {
    const value = parseInt(this.docsJsonData.mVariablePowerConsumptionFactor, 10)

    return value === 1 ? 0 : value
  }

  private get duration() {
    return parseInt(this.docsJsonData.mManufactoringDuration, 10)
  }

  private get isAlt() {
    return this.docsJsonData.ClassName.startsWith('Recipe_Alternate_')
  }

  private get manufacturerClassName() {
    const manufacturerClassName = trim(this.docsJsonData.mProducedIn, '()"').split('.').pop()

    if (manufacturerClassName === undefined) {
      throw new Error(`Could not parse mProducedIn property in class ${this.docsJsonData.ClassName}`)
    }

    return manufacturerClassName
  }

  private async getManufacturerId() {
    const manufacturerModel = await Manufacturer.findBy('class', this.manufacturerClassName)

    if (manufacturerModel === null) {
      throw new Error(`Could not find ${this.manufacturerClassName} manufacturer`)
    }

    return manufacturerModel.id
  }

  private async saveInputResources(recipeId: number) {
    for (const inputResource of this.inputResources) {
      try {
        const resource = await Component.findByOrFail('class', inputResource.item)

        const model = new RecipeInput()

        model.recipeId = recipeId
        model.resourceId = resource.id
        model.amount = inputResource.amount

        await model.save()
      } catch (error) {
        throw new Error(`Could not find ${inputResource.item} component`)
      }
    }
  }

  private async saveOutputProducts(recipeId: number) {
    for (const outputProduct of this.outputProducts) {
      try {
        const product = await Component.findByOrFail('class', outputProduct.item)

        const model = new RecipeOutput()

        model.recipeId = recipeId
        model.productId = product.id
        model.amount = outputProduct.amount

        await model.save()
      } catch (error) {
        throw new Error(`Could not find ${outputProduct.item} component`)
      }
    }
  }

  async save() {
    if (this.skip) {
      return
    }

    const model = new Recipe()

    const manufacturerId = await this.getManufacturerId()

    model.class = this.docsJsonData.ClassName
    model.nameLocaleKey = this.nameLocaleKey
    model.isAlt = this.isAlt
    model.manufacturerId = manufacturerId
    model.powerConsumption = this.powerConsumption
    model.duration = this.duration

    await model.save()

    await this.saveInputResources(model.id)
    await this.saveOutputProducts(model.id)

    consola.success(`Recipe ${chalk.bold.cyanBright(this.docsJsonData.ClassName)} saved`)
  }

  static async parseDocsJson() {
    const jsonDataList = this.getDocsJsonDescriptors([
      'FGRecipe',
    ])

    await FGRecipeModel.truncate(Recipe)

    for (const jsonData of jsonDataList) {
      const model = new this(jsonData)

      await model.save()
    }
  }
}
