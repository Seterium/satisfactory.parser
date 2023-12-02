import { FGAbstractModel } from 'App/FGModels'

import Component from 'App/Models/Component'
import Blueprint from 'App/Models/Blueprint'
import BlueprintComponent from 'App/Models/BlueprintComponent'

import chalk from 'chalk'
import consola from 'consola'
import { parseRecipeString } from 'App/Utils'

export class FGBlueprintModel extends FGAbstractModel {
  constructor(blueprintJsonData: Record<string, any>) {
    super(blueprintJsonData, 'recipe')
  }

  private get components() {
    return parseRecipeString(this.recipeJsonData.mIngredients)
  }

  async saveComponents(blueprintId: number) {
    for (const component of this.components) {
      const componentModel = await Component.findByOrFail('class', component.item)

      const blueprintModel = new BlueprintComponent()

      blueprintModel.blueprintId = blueprintId
      blueprintModel.componentId = componentModel.id
      blueprintModel.amount = component.amount

      await blueprintModel.save()
    }
  }

  async save(): Promise<number> {
    const model = new Blueprint()

    model.class = this.className

    await model.save()

    await this.saveComponents(model.id)

    consola.success(`Blueprint ${chalk.bold.cyanBright(this.className)} saved`)

    return model.id
  }
}
