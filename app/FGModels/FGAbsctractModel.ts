import type { DocsJsonSchema, DocsJsonSchemaItem } from 'App/Types'

import fs from 'fs'

import Env from '@ioc:Adonis/Core/Env'
import Database from '@ioc:Adonis/Lucid/Database'

import Locale from 'App/Models/Locale'
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

  constructor(data: Record<string, any>) {
    this.docsJsonData = data

    this.fmodelData = this.getFModelDesc()
  }

  private getFModelDesc() {
    const filepath = globSync(`${Env.get('FG_FMODEL_EXPORTS_PATH')}/**/Desc_${this.cleanedClassName}.json`).pop()

    if (filepath === undefined) {
      throw new Error(`Could not find ${this.cleanedClassName} desc class data in FModel exports`)
    }

    const fmodelData: Record<string, any>[] = JSON.parse(fs.readFileSync(filepath).toString())

    return fmodelData
  }

  protected getFModelBuildDesc() {
    const filepath = globSync(`${Env.get('FG_FMODEL_EXPORTS_PATH')}/**/Build_${this.cleanedClassName}.json`).pop()

    if (filepath === undefined) {
      throw new Error(`Could not find ${this.cleanedClassName} build class data in FModel exports`)
    }

    const fmodelData: Record<string, any>[] = JSON.parse(fs.readFileSync(filepath).toString())

    return fmodelData
  }

  protected get unsuffixedClassName() {
    return this.docsJsonData.ClassName.slice(0, -2)
  }

  protected get cleanedClassName() {
    return this.unsuffixedClassName.substring(5)
  }

  protected get nameLocaleKey(): string {
    const nameLoc = this.fmodelData[1].Properties?.mDisplayName?.Key

    if (typeof nameLoc !== 'string') {
      throw new Error(`Could not find mDisplayName.Key in ${this.cleanedClassName} fmodel data`)
    }

    return nameLoc
  }

  protected get icon(): string {
    const iconPath = this.fmodelData[1].Properties?.mPersistentBigIcon?.ObjectPath

    if (typeof iconPath !== 'string') {
      throw new Error(`Could not find icon for ${this.cleanedClassName}`)
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

  protected async saveLocale(localeKey: string): Promise<number> {
    const existed = await Locale.findBy('key', localeKey)

    if (existed !== null) {
      return existed.id
    }

    const model = new Locale()

    model.key = localeKey

    await model.save()

    return model.id
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
