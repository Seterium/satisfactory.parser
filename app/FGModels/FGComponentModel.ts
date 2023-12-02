import { FGAbstractModel } from 'App/FGModels'

import Component from 'App/Models/Component'

import chalk from 'chalk'
import consola from 'consola'

export class FGComponentModel extends FGAbstractModel {
  baseModel = Component

  private get sinkPoints(): number {
    if (this.docsJsonData.mForm === 'RF_LIQUID') {
      return 0
    }

    const pointsString = this.docsJsonData.mResourceSinkPoints

    if (typeof pointsString !== 'string') {
      throw new Error(`Could not find mResourceSinkPoints in ${this.cleanedClassName} Docs.json data`)
    }

    return parseInt(pointsString, 10)
  }

  async save() {
    const componentModel = new Component()

    componentModel.class = this.docsJsonData.ClassName
    componentModel.type = this.docsJsonData.mForm as Component['type']
    componentModel.nameLocaleKey = this.nameLocaleKey
    componentModel.icon = this.icon
    componentModel.sinkPoints = this.sinkPoints

    await componentModel.save()

    consola.success(`Component ${chalk.bold.cyanBright(this.docsJsonData.ClassName)} saved`)
  }

  static async parseDocsJson() {
    const jsonDataList = this.getDocsJsonDescriptors([
      'FGItemDescriptor',
      'FGItemDescriptorBiomass',
      'FGItemDescriptorNuclearFuel',
      'FGResourceDescriptor',
      'FGEquipmentDescriptor',
      'FGConsumableDescriptor',
      'FGAmmoTypeProjectile',
      'FGAmmoTypeInstantHit',
    ])

    await this.truncate(Component)

    for (const jsonData of jsonDataList) {
      const model = new this(jsonData)

      await model.save()
    }
  }
}
