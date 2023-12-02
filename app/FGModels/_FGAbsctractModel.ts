import type { DocsJsonSchema, DocsJsonSchemaItem } from 'App/Types'

import fs from 'fs'

import Env from '@ioc:Adonis/Core/Env'
import Database from '@ioc:Adonis/Lucid/Database'

import Component from 'App/Models/Component'
import Extractor from 'App/Models/Extractor'
import Fuel from 'App/Models/Fuel'
import Generator from 'App/Models/Generator'
import Manufacturer from 'App/Models/Manufacturer'
import Recipe from 'App/Models/Recipe'
import RecipeInput from 'App/Models/RecipeInput'
import RecipeOutput from 'App/Models/RecipeOutput'

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

export abstract class FGAbstractModel {
  protected docsJsonData: Record<string, any>

  protected fmodelData: Record<string, any>

  constructor(data: Record<string, any>, loadFModelData = true) {
    this.docsJsonData = data

    if (loadFModelData) {
      this.fmodelData = this.getFModelDesc()
    }
  }

  protected getFModelDesc() {
    let filepath = globSync(`${Env.get('FG_FMODEL_EXPORTS_PATH')}/**/Desc_${this.cleanedClassName}.json`).pop()

    if (filepath === undefined) {
      filepath = globSync(`${Env.get('FG_FMODEL_EXPORTS_PATH')}/**/BP_${this.cleanedClassName}.json`).pop()
    }

    if (filepath === undefined) {
      throw new Error(`Could not find ${this.docsJsonData.ClassName} (${this.cleanedClassName}) desc class data in FModel exports`)
    }

    const fmodelData: Record<string, any>[] = JSON.parse(fs.readFileSync(filepath).toString())

    return fmodelData
  }

  protected getFModelBuildDesc() {
    const filepath = globSync(`${Env.get('FG_FMODEL_EXPORTS_PATH')}/**/Build_${this.cleanedClassName}.json`).pop()

    if (filepath === undefined) {
      throw new Error(`Could not find ${this.docsJsonData.ClassName} build class data in FModel exports`)
    }

    const fmodelData: Record<string, any>[] = JSON.parse(fs.readFileSync(filepath).toString())

    return fmodelData
  }

  protected getFModelRecipeDesc() {
    const className = this.cleanedClassName.startsWith('e_')
      ? this.cleanedClassName.substring(2)
      : this.cleanedClassName

    const filepath = globSync(`${Env.get('FG_FMODEL_EXPORTS_PATH')}/**/Recipe_${className}.json`).pop()

    if (filepath === undefined) {
      throw new Error(`Could not find ${this.docsJsonData.ClassName} (Recipe_${className}) recipe class data in FModel exports`)
    }

    const fmodelData: Record<string, any>[] = JSON.parse(fs.readFileSync(filepath).toString())

    return fmodelData
  }

  protected get unsuffixedClassName() {
    return this.docsJsonData.ClassName.slice(0, -2)
  }

  protected get cleanedClassName(): string {
    if (this.unsuffixedClassName.startsWith('Desc_')) {
      return this.unsuffixedClassName.substring(5)
    }

    if (this.unsuffixedClassName.startsWith('Build_')) {
      return this.unsuffixedClassName.substring(6)
    }

    if (this.unsuffixedClassName.startsWith('Recipe_')) {
      return this.unsuffixedClassName.substring(7)
    }

    if (this.unsuffixedClassName.startsWith('BP_')) {
      return this.unsuffixedClassName.substring(3)
    }

    return this.unsuffixedClassName
  }

  protected get nameLocaleKey(): string {
    // console.log('-------------------------')
    // console.log(JSON.stringify(this.fmodelData, null, 2))
    // console.log('-------------------------')

    const nameLocaleKey = this.fmodelData.find((fmodelData) => {
      return fmodelData.Properties?.mDisplayName?.Key
    })?.Properties?.mDisplayName?.Key

    if (typeof nameLocaleKey !== 'string') {
      throw new Error(`Could not find mDisplayName.Key in ${this.docsJsonData.ClassName} fmodel data`)
    }

    return nameLocaleKey
  }

  protected get icon(): string {
    const iconPath = this.fmodelData.find((fmodelData) => {
      return fmodelData.Properties?.mPersistentBigIcon?.ObjectPath
    })?.Properties?.mPersistentBigIcon?.ObjectPath

    if (typeof iconPath !== 'string') {
      throw new Error(`Could not find icon for ${this.docsJsonData.ClassName}`)
    }

    return iconPath.replace('.0', '')
  }

  static async truncate(model: FGOrmModels) {
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
