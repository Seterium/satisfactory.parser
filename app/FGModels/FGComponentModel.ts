import { FGAbstractModel } from 'App/FGModels'

import Component from 'App/Models/Component'

import chalk from 'chalk'
import consola from 'consola'

export class FGComponentModel extends FGAbstractModel {
  private get sinkPoints(): number {
    if (this.descJsonData.mForm === 'RF_LIQUID') {
      return 0
    }

    const pointsString = this.descJsonData.mResourceSinkPoints

    if (typeof pointsString !== 'string') {
      throw new Error(`Could not find mResourceSinkPoints in ${this.cleanedClassName} Docs.json data`)
    }

    return parseInt(pointsString, 10)
  }

  async save() {
    const componentModel = new Component()

    componentModel.class = this.cleanedClassName
    componentModel.type = this.descJsonData.mForm as Component['type']
    componentModel.nameLocaleId = await this.saveLocale(this.descNameLocale)
    componentModel.icon = this.icon
    componentModel.sinkPoints = this.sinkPoints

    await componentModel.save()

    consola.success(`Component ${chalk.bold.cyanBright(this.cleanedClassName)} saved`)
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
      const model = new this(jsonData, 'desc')

      await model.save()
    }
  }
}
