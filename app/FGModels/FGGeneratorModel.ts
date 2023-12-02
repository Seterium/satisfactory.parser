import { FGAbstractModel } from 'App/FGModels'
import Component from 'App/Models/Component'

import Fuel from 'App/Models/Fuel'
import Generator from 'App/Models/Generator'

import chalk from 'chalk'
import consola from 'consola'

interface FuelData {
  fuel: string

  supplemental: string | null

  waste: string | null

  wasteAmount: number
}

export class FGGeneratorModel extends FGAbstractModel {
  private fuelsDescs: Record<string, any>[]

  constructor(
    generatorJsonData: Record<string, any>,
    fuelsDescs: Record<string, any>[],
  ) {
    super(generatorJsonData, 'build', {
      loadRecipeJsonData: true,
      loadDescJsonData: true,
      loadDescFModelData: true,
    })

    this.fuelsDescs = fuelsDescs
  }

  private get power() {
    const value = this.buildFModelData.find((data) => {
      const type = `Build_${this.cleanedClassName}_C`

      return data?.Type === type
        && data?.Name === `Default__${type}`
        && data?.Properties?.mPowerProduction
    })?.Properties.mPowerProduction

    if (value === undefined) {
      throw new Error(`Could not find power value for ${this.cleanedClassName}`)
    }

    return value
  }

  private get waterConsumption() {
    const {
      mRequiresSupplementalResource,
      mSupplementalLoadAmount,
      mSupplementalToPowerRatio,
      mPowerProduction,
    } = this.buildJsonData

    if (mRequiresSupplementalResource === 'False') {
      return 0
    }

    const supplementalLoadAmount = parseFloat(mSupplementalLoadAmount)
    const supplementalToPowerRatio = parseFloat(mSupplementalToPowerRatio)
    const powerProduction = parseFloat(mPowerProduction)

    const powerMJ = powerProduction * 60

    return (powerMJ / supplementalLoadAmount) * supplementalToPowerRatio * (supplementalLoadAmount / 1000)
  }

  private get fuels(): FuelData[] {
    if (this.buildJsonData.mFuel[0].mFuelClass.startsWith('FG')) {
      return this.fuelsDescs.filter(({ NativeClass }) => NativeClass === 'FGItemDescriptorBiomass').map((fuel) => ({
        fuel: fuel.ClassName,
        supplemental: null,
        waste: null,
        wasteAmount: 0,
      }))
    }

    return this.buildJsonData.mFuel.map((fuelData) => ({
      fuel: fuelData.mFuelClass,
      supplemental: fuelData.mSupplementalResourceClass ?? null,
      waste: fuelData.mByproduct ?? null,
      wasteAmount: fuelData.mByproductAmount ? parseInt(fuelData.mByproductAmount, 10) : 0,
    }))
  }

  private async saveFuels(generatorId: number) {
    const fuelsData = this.fuels

    for (const fuelData of fuelsData) {
      const fuelModel = new Fuel()

      fuelModel.generatorId = generatorId

      const fuelItemModel = await Component.findByOrFail('class', fuelData.fuel)

      const fuelItemJsonData = this.fuelsDescs.find(({ ClassName }) => ClassName === fuelData.fuel)

      if (fuelItemJsonData === undefined) {
        throw new Error(`Could not find ${fuelData.fuel} class desc`)
      }

      fuelModel.fuelId = fuelItemModel.id
      fuelModel.energy = parseInt(fuelItemJsonData.mEnergyValue, 10)

      if (fuelData.waste && fuelData.wasteAmount) {
        const wasteJsonData = this.fuelsDescs.find(({ ClassName }) => ClassName === fuelData.waste)

        if (wasteJsonData === undefined) {
          throw new Error(`Could not find ${fuelData.fuel} class desc`)
        }

        const wasteItemModel = await Component.findByOrFail('class', fuelData.waste)

        fuelModel.wasteId = wasteItemModel.id
        fuelModel.wasteAmount = fuelData.wasteAmount
      }

      if (fuelModel.energy > 0) {
        await fuelModel.save()
      }
    }
  }

  async save() {
    const model = new Generator()

    model.class = this.className
    model.nameLocaleKey = this.buildNameLocale
    model.blueprintId = await this.saveBlueprint()
    model.icon = this.icon
    model.power = this.power
    model.waterConsumption = this.waterConsumption

    await model.save()

    await this.saveFuels(model.id)

    consola.success(`Generator ${chalk.bold.cyanBright(this.className)} saved`)
  }

  static async truncateAll() {
    await FGGeneratorModel.truncate(Fuel)
    await FGGeneratorModel.truncate(Generator)
  }

  static async parseDocsJson() {
    const generatorsJsonData = FGGeneratorModel.getDocsJsonDescriptors([
      'FGBuildableGeneratorFuel',
      'FGBuildableGeneratorNuclear',
    ])

    const fuelsJsonData = FGGeneratorModel.getDocsJsonDescriptors([
      'FGItemDescriptorNuclearFuel',
      'FGItemDescriptorBiomass',
      'FGResourceDescriptor',
      'FGItemDescriptor',
    ])

    await FGGeneratorModel.truncateAll()

    for (const generatorJsonData of generatorsJsonData) {
      const model = new this(generatorJsonData, fuelsJsonData)

      await model.save()
    }
  }
}
