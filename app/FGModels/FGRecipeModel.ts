import { FGAbstractModel } from 'App/FGModels'
import Component from 'App/Models/Component'

import Recipe from 'App/Models/Recipe'
import RecipeInput from 'App/Models/RecipeInput'
import RecipeOutput from 'App/Models/RecipeOutput'

import { parseRecipeString } from 'App/Utils'
import chalk from 'chalk'
import consola from 'consola'

export class FGRecipeModel extends FGAbstractModel {
  constructor(recipeJsonData: Record<string, any>, loadFModelData = true) {
    super(recipeJsonData, loadFModelData)
  }

  private get inputResources() {
    return parseRecipeString(this.docsJsonData.mIngredients)
  }

  private get outputProducts() {
    return parseRecipeString(this.docsJsonData.mProduct)
  }

  private async saveInputResources(recipeId: number) {
    for (const inputResource of this.inputResources) {
      const resource = await Component.findByOrFail('class', inputResource.item)

      const model = new RecipeInput()

      model.recipeId = recipeId
      model.resourceId = resource.id
      model.amount = inputResource.amount

      await model.save()
    }
  }

  private async saveOutputProducts(recipeId: number) {
    for (const outputProduct of this.outputProducts) {
      const product = await Component.findByOrFail('class', outputProduct.item)

      const model = new RecipeOutput()

      model.recipeId = recipeId
      model.productId = product.id
      model.amount = outputProduct.amount

      await model.save()
    }
  }

  async save(saveOutputs = true) {
    const model = new Recipe()

    model.class = this.docsJsonData.ClassName
    model.isAlt = false

    await model.save()

    await this.saveInputResources(model.id)

    if (saveOutputs) {
      await this.saveOutputProducts(model.id)
    }

    consola.success(`Recipe with class ${chalk.bold.cyanBright(this.docsJsonData.ClassName)} saved`)

    return model.id
  }

  static async parseDocsJson() {
    const jsonDataList = this.getDocsJsonDescriptors([
      //
    ])

    for (const jsonData of jsonDataList) {
      const model = new this(jsonData)

      await model.save()
    }
  }
}
