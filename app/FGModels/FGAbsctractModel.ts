import type { DocsJsonSchema, DocsJsonSchemaItem } from 'App/Types'

import fs from 'fs'

import Env from '@ioc:Adonis/Core/Env'

import Database from '@ioc:Adonis/Lucid/Database'

import Blueprint from 'App/Models/Blueprint'
import BlueprintComponent from 'App/Models/BlueprintComponent'
import Component from 'App/Models/Component'
import Extractor from 'App/Models/Extractor'
import Fuel from 'App/Models/Fuel'
import Generator from 'App/Models/Generator'
import Manufacturer from 'App/Models/Manufacturer'
import Recipe from 'App/Models/Recipe'
import RecipeInput from 'App/Models/RecipeInput'
import RecipeOutput from 'App/Models/RecipeOutput'
import Transport from 'App/Models/Transport'

import chalk from 'chalk'
import consola from 'consola'
import { globSync } from 'glob'

type FGOrmModels = typeof Component
  | typeof Extractor
  | typeof Fuel
  | typeof Generator
  | typeof Manufacturer
  | typeof Recipe
  | typeof RecipeInput
  | typeof RecipeOutput
  | typeof Blueprint
  | typeof BlueprintComponent
  | typeof Transport

type DocsJsonType = 'desc' | 'build' | 'recipe' | 'bp'

interface FGModelOptions {
  loadDescJsonData?: boolean

  loadDescFModelData?: boolean

  loadBuildJsonData?: boolean

  loadBuildFModelData?: boolean

  loadRecipeJsonData?: boolean

  loadRecipeFModelData?: boolean
}

export abstract class FGAbstractModel {
  protected type: DocsJsonType

  protected descJsonData: Record<string, any> = {}

  protected descFModelData: Record<string, any>[] = []

  protected recipeJsonData: Record<string, any> = {}

  protected recipeFModelData: Record<string, any>[] = []

  protected buildJsonData: Record<string, any> = {}

  protected buildFModelData: Record<string, any>[] = []

  constructor(docsJsonData: Record<string, any>, type: DocsJsonType, options: FGModelOptions) {
    this.type = type

    switch (type) {
      case 'desc':
        this.descJsonData = docsJsonData
        this.descFModelData = this.getDescFModelData()
        break

      case 'build':
        this.buildJsonData = docsJsonData
        this.buildFModelData = this.getBuildFModelData()
        break

      case 'recipe':
        this.recipeJsonData = docsJsonData
        this.recipeFModelData = this.getRecipeFModelData()
        break

        // case 'bp':
        //   this.bpJsonData = docsJsonData
        //   this.bpFModelData = this.getRecipeFModelData()
        //   break

      default:
        break
    }

    if (options.loadDescJsonData) {
      this.descJsonData = this.getDescJsonData()
    }

    if (options.loadDescFModelData) {
      this.descFModelData = this.getDescFModelData()
    }

    if (options.loadBuildJsonData) {
      this.buildJsonData = this.getBuildJsonData()
    }

    if (options.loadBuildFModelData) {
      this.buildFModelData = this.getBuildFModelData()
    }

    if (options.loadRecipeJsonData) {
      this.recipeJsonData = this.getRecipeJsonData()
    }

    if (options.loadRecipeFModelData) {
      this.recipeFModelData = this.getRecipeFModelData()
    }
  }

  protected get className() {
    const type = this.type

    if (type === 'desc') {
      const value = this.descJsonData.ClassName

      if (typeof value !== 'string') {
        throw new Error(`Could not find ClassName property in ${type} json data`)
      }

      return value
    }

    if (type === 'build') {
      const value = this.buildJsonData.ClassName

      if (typeof value !== 'string') {
        throw new Error(`Could not find ClassName property in ${type} json data`)
      }

      return value
    }

    if (type === 'recipe') {
      const value = this.buildJsonData.ClassName

      if (typeof value !== 'string') {
        throw new Error(`Could not find ClassName property in ${type} json data`)
      }

      return value
    }

    throw new Error(`Unknown type property value: ${type}`)
  }

  protected get cleanedClassName() {
    const type = this.type

    if (type === 'desc') {
      const value = this.descJsonData.ClassName

      if (typeof value !== 'string') {
        throw new Error(`Could not find ClassName property in ${type} json data`)
      }

      return value.slice(0, -2).substring(5)
    }

    if (type === 'build') {
      const value = this.buildJsonData.ClassName

      if (typeof value !== 'string') {
        throw new Error(`Could not find ClassName property in ${type} json data`)
      }

      return value.slice(0, -2).substring(6)
    }

    if (type === 'recipe') {
      const value = this.buildJsonData.ClassName

      if (typeof value !== 'string') {
        throw new Error(`Could not find ClassName property in ${type} json data`)
      }

      return value.slice(0, -2).substring(7)
    }

    throw new Error(`Unknown type property value: ${type}`)
  }

  protected get isBP() {
    return this.descJsonData.ClassName.startsWith('BP_')
  }

  protected get descNameLocale(): string {
    return ''
  }

  protected get buildNameLocale(): string {
    return ''
  }

  protected get recipeNameLocale(): string {
    return ''
  }

  protected get icon(): string {
    return ''
  }

  protected getDescJsonData(): Record<string, any> {
    return {}
    // 'FGItemDescriptor',
    // 'FGBuildingDescriptor',
    // 'FGResourceDescriptor',
    // 'FGPoleDescriptor',
    // 'FGEquipmentDescriptor',
    // 'FGItemDescriptorBiomass',
    // 'FGItemDescriptorNuclearFuel',
    // 'FGVehicleDescriptor',
    // 'FGConsumableDescriptor',
    // 'FGAmmoTypeProjectile',
    // 'FGAmmoTypeSpreadshot',
    // 'FGAmmoTypeInstantHit'
  }

  protected getDescFModelData() {
    let filepath = globSync(`${Env.get('FG_FMODEL_EXPORTS_PATH')}/**/Desc_${this.cleanedClassName}.json`).pop()

    if (filepath === undefined) {
      filepath = globSync(`${Env.get('FG_FMODEL_EXPORTS_PATH')}/**/BP_${this.cleanedClassName}.json`).pop()
    }

    if (filepath === undefined) {
      throw new Error(`Could not find Desc_${this.cleanedClassName} class data in FModel exports`)
    }

    const fmodelData: Record<string, any>[] = JSON.parse(fs.readFileSync(filepath).toString())

    return fmodelData
  }

  protected getBuildJsonData(): Record<string, any> {
    return {}
    // 'FGBuildableDroneStation',
    // 'FGBuildableBlueprintDesigner',
    // 'FGBuildableWallLightweight',
    // 'FGBuildableWall',
    // 'FGBuildableDoor',
    // 'FGBuildableCornerWall',
    // 'FGBuildableRailroadTrack',
    // 'FGBuildable',
    // 'FGBuildablePoleLightweight',
    // 'FGBuildableConveyorBelt',
    // 'FGBuildableWire',
    // 'FGBuildablePowerPole',
    // 'FGBuildableTradingPost',
    // 'FGBuildablePillarLightweight',
    // 'FGBuildableFactory',
    // 'FGBuildableWalkwayLightweight',
    // 'FGBuildableWalkway',
    // 'FGBuildableGeneratorFuel',
    // 'FGBuildablePipelineSupport',
    // 'FGBuildablePipeline',
    // 'FGBuildablePipelineJunction',
    // 'FGBuildablePipelinePump',
    // 'FGBuildablePipeReservoir',
    // 'FGBuildableWaterPump',
    // 'FGBuildableResourceSink',
    // 'FGBuildableResourceSinkShop',
    // 'FGBuildableResourceExtractor',
    // 'FGBuildableManufacturer',
    // 'FGBuildableManufacturerVariablePower',
    // 'FGBuildableGeneratorNuclear',
    // 'FGBuildableFrackingExtractor',
    // 'FGBuildableFrackingActivator',
    // 'FGBuildableConveyorLift',
    // 'FGBuildableRailroadSignal',
    // 'FGBuildableTrainPlatformCargo',
    // 'FGBuildableTrainPlatformEmpty',
    // 'FGBuildableRailroadStation',
    // 'FGBuildableStorage',
    // 'FGPipeHyperStart',
    // 'FGBuildablePipeHyper',
    // 'FGBuildablePowerStorage',
    // 'FGBuildableDockingStation',
    // 'FGConveyorPoleStackable',
    // 'FGBuildableJumppad',
    // 'FGBuildableMAM',
    // 'FGBuildableAttachmentMerger',
    // 'FGBuildableAttachmentSplitter',
    // 'FGBuildableFoundation',
    // 'FGBuildableFoundationLightweight',
    // 'FGBuildableRamp',
    // 'FGBuildableGeneratorGeoThermal',
    // 'FGBuildableSplitterSmart',
    // 'FGBuildablePriorityPowerSwitch',
    // 'FGBuildableCircuitSwitch',
    // 'FGBuildableRadarTower',
    // 'FGBuildableSnowDispenser',
    // 'FGBuildableFactorySimpleProducer',
    // 'FGBuildableLadder',
    // 'FGBuildableStair',
    // 'FGBuildablePassthrough',
    // 'FGBuildableLightsControlPanel',
    // 'FGBuildableLightSource',
    // 'FGBuildableFloodlight',
    // 'FGBuildableWidgetSign',
    // 'FGBuildablePassthroughPipeHyper',
    // 'FGBuildableBeamLightweight',
    // 'FGBuildableFactoryBuilding',
    // 'FGBuildableSpaceElevator'
  }

  protected getBuildFModelData() {
    const filepath = globSync(`${Env.get('FG_FMODEL_EXPORTS_PATH')}/**/Build_${this.cleanedClassName}.json`).pop()

    if (filepath === undefined) {
      throw new Error(`Could not find Build_${this.cleanedClassName} build class data in FModel exports`)
    }

    const fmodelData: Record<string, any>[] = JSON.parse(fs.readFileSync(filepath).toString())

    return fmodelData
  }

  protected getRecipeJsonData(): Record<string, any> {
    return {}
    // FGRecipe
  }

  protected getRecipeFModelData() {
    const filepath = globSync(`${Env.get('FG_FMODEL_EXPORTS_PATH')}/**/Recipe_${this.cleanedClassName}.json`).pop()

    if (filepath === undefined) {
      throw new Error(`Could not find Recipe_${this.cleanedClassName} class data in FModel exports`)
    }

    const fmodelData: Record<string, any>[] = JSON.parse(fs.readFileSync(filepath).toString())

    return fmodelData
  }

  protected static async truncate(model: FGOrmModels) {
    const rows = await model.all()

    for (const row of rows) {
      await row.delete()
    }

    const db = Database.connection()

    await db.rawQuery(`ALTER TABLE ${model.table} AUTO_INCREMENT=1;`)

    consola.success(`${chalk.bold.cyanBright(model.table)} table truncating completed`)
  }

  protected static getDocsJsonDescriptors(descriptors: string[]) {
    const docsJsonRaw = fs.readFileSync(Env.get('FG_DOCS_JSON_PATH')).toString()

    const docsJsonData: DocsJsonSchema | undefined = JSON.parse(docsJsonRaw)

    if (docsJsonData === undefined) {
      throw new Error(`Cannot parse Docs.json from ${Env.get('FG_DOCS_JSON_PATH')}`)
    }

    return descriptors.reduce<DocsJsonSchemaItem['Classes']>((result, descriptorClass) => {
      const descriptor = docsJsonData.find(({ NativeClass }) => NativeClass.includes(`${descriptorClass}'`))

      if (descriptor === undefined) {
        throw new Error(`Could not load ${descriptorClass} descriptor classes`)
      }

      const mappedClasses = descriptor.Classes.map((classData) => {
        classData.NativeClass = descriptorClass

        return classData
      })

      result.push(...mappedClasses)

      return result
    }, [])
  }
}
