import { FGAbstractModel, FGBlueprintModel } from 'App/FGModels'
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
  private buildDecs: Record<string, any>[]

  private fuelsDescs: Record<string, any>[]

  private recipesDescs: Record<string, any>[]

  constructor(
    generatorJsonData: Record<string, any>,
    fuelsDescs: Record<string, any>[],
    recipesDescs: Record<string, any>[],
  ) {
    super(generatorJsonData)
    this.buildDecs = this.getFModelBuildDesc()
    this.fuelsDescs = fuelsDescs
    this.recipesDescs = recipesDescs
  }

  protected get icon() {
    const iconPath = this.fmodelData[1].Properties?.mPersistentBigIcon?.ObjectPath

    if (typeof iconPath !== 'string') {
      throw new Error(`Could not find icon for ${this.cleanedClassName}`)
    }

    return iconPath.replace('.0', '')
  }

  protected get nameLocaleKey() {
    const buildDescWithDisplayNameProperty = this.buildDecs.find((buildDesc) => {
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

  private get power() {
    const buildDescWithPowerProperty = this.buildDecs.find((buildDesc) => {
      const type = `Build_${this.cleanedClassName}_C`

      return buildDesc?.Type === type
        && buildDesc?.Name === `Default__${type}`
        && buildDesc?.Properties?.mPowerProduction
    })

    if (buildDescWithPowerProperty === undefined) {
      throw new Error(`Could not find power value for ${this.cleanedClassName}`)
    }

    return buildDescWithPowerProperty.Properties.mPowerProduction
  }

  private get waterConsumption() {
    const {
      mRequiresSupplementalResource,
      mSupplementalLoadAmount,
      mSupplementalToPowerRatio,
      mPowerProduction,
    } = this.docsJsonData

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
    if (this.docsJsonData.mFuel[0].mFuelClass.startsWith('FG')) {
      return this.fuelsDescs.filter(({ NativeClass }) => NativeClass === 'FGItemDescriptorBiomass').map((fuel) => ({
        fuel: fuel.ClassName,
        supplemental: null,
        waste: null,
        wasteAmount: 0,
      }))
    }

    return this.docsJsonData.mFuel.map((fuelData) => ({
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

  private async saveBlueprint() {
    const blueprintJsonData = this.recipesDescs.find(({ ClassName }) => ClassName === `Recipe_${this.cleanedClassName}_C`)

    if (blueprintJsonData === undefined) {
      throw new Error(`Could not find recipe for ${this.docsJsonData.ClassName}`)
    }

    const blueprintModel = new FGBlueprintModel(blueprintJsonData)

    const blueprintId = await blueprintModel.save()

    return blueprintId
  }

  async save() {
    const model = new Generator()

    model.class = this.docsJsonData.ClassName
    model.nameLocaleKey = this.nameLocaleKey
    model.blueprintId = await this.saveBlueprint()
    model.icon = this.icon
    model.power = this.power
    model.waterConsumption = this.waterConsumption

    await model.save()

    await this.saveFuels(model.id)

    consola.success(`Generator ${chalk.bold.cyanBright(this.docsJsonData.ClassName)} saved`)
  }

  static async truncateAll() {
    await FGGeneratorModel.truncate(Fuel)
    await FGGeneratorModel.truncate(Generator)
  }

  static async parseDocsJson() {
    const isComponentsTableFilled = (await Component.all()).length === 0

    if (isComponentsTableFilled) {
      throw new Error('Components table is empty')
    }

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

    const recipesJsonData = FGGeneratorModel.getDocsJsonDescriptors([
      'FGRecipe',
    ])

    await FGGeneratorModel.truncateAll()

    for (const generatorJsonData of generatorsJsonData) {
      const model = new this(generatorJsonData, fuelsJsonData, recipesJsonData)

      await model.save()
    }
  }
}
