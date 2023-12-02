import type { NPowerPlanner } from 'App/Types'

import fs from 'fs'
import path from 'path'

import Env from '@ioc:Adonis/Core/Env'
import Application from '@ioc:Adonis/Core/Application'

import Fuel from 'App/Models/Fuel'
import Generator from 'App/Models/Generator'
import Component from 'App/Models/Component'

import md5 from 'md5'
import chalk from 'chalk'
import consola from 'consola'
import { uniq } from 'lodash'

const WATER_CLASS = 'Water'
const POWER_SHARD = 'CrystalShard'

export default class PowerPlanner {
  private outputBaseDir = Application.publicPath('output/powerPlanner')

  private imagesOutput = Application.publicPath('output/powerPlanner/images')

  public async generate() {
    this.cleanOutput()

    const generators = await this.getGeneratorsData()
    const fuels = await this.getFuelsData()
    const components = await this.getComponentsData(generators)

    const datafile: NPowerPlanner.IDatafile = {
      generators,
      fuels,
      components,
      waterClass: WATER_CLASS,
      powerShardClass: POWER_SHARD,
    }

    fs.writeFileSync(path.join(this.outputBaseDir, 'powerPlanner.json'), JSON.stringify(datafile, null, 2))
  }

  private cleanOutput() {
    if (fs.existsSync(this.outputBaseDir)) {
      fs.rmSync(this.outputBaseDir, {
        recursive: true,
        force: true,
      })
    }

    fs.mkdirSync(this.outputBaseDir, {
      recursive: true,
    })

    fs.mkdirSync(this.imagesOutput, {
      recursive: true,
    })
  }

  private async saveIcon(iconPath: string): Promise<string> {
    const fullPath = path.join(Env.get('FG_FMODEL_EXPORTS_PATH'), `${iconPath}.png`)

    if (fs.existsSync(fullPath) === false) {
      throw new Error(`Could not find image: ${fullPath}`)
    }

    const filename = md5(fullPath)
    const savePath = path.join(this.imagesOutput, `${filename}.png`)

    fs.copyFileSync(fullPath, savePath)

    consola.success(`Icon ${chalk.bold.cyanBright(iconPath)} saved ${chalk.bold.greenBright(savePath)}`)

    return filename
  }

  private async getGeneratorsData(): Promise<NPowerPlanner.IGenerator[]> {
    const generators = await Generator.query()
      .orderBy('power')
      .preload('blueprint', (blueprint) => {
        return blueprint.preload('components', (blueprintItem) => {
          return blueprintItem.preload('component')
        })
      })
      .preload('name')
      .preload('fuels', (fuel) => {
        return fuel.preload('component')
      })

    const result = Promise.all(generators.map(async (generator) => ({
      name: generator.name.value,
      class: generator.class,
      icon: await this.saveIcon(generator.icon),
      power: generator.power,
      blueprint: generator.blueprint.components.map(({ component, amount }) => ({
        component: component.class,
        amount,
      })),
      fuels: generator.fuels.map((fuel) => fuel.component.class),
      waterConsumption: generator.waterConsumption,
    })))

    consola.success(`${chalk.bold.cyanBright('Generators')} data generated`)

    return result
  }

  private async getFuelsData(): Promise<NPowerPlanner.IFuel[]> {
    const fuels = await Fuel.query()
      .orderBy('energy')
      .preload('component', (component) => {
        return component.preload('name')
      })

    const result = Promise.all(fuels.map(async (fuel) => {
      const waste = fuel.wasteId ? await Component.findOrFail(fuel.wasteId) : undefined

      return {
        name: fuel.component.name.value,
        class: fuel.component.class,
        icon: await this.saveIcon(fuel.component.icon),
        energy: fuel.component.type === 'RF_LIQUID' ? fuel.energy * 1000 : fuel.energy,
        waste: waste ? waste.class : undefined,
        wasteAmount: waste ? fuel.wasteAmount : undefined,
      }
    }))

    consola.success(`${chalk.bold.cyanBright('Fuels')} data generated`)

    return result
  }

  private async getComponentsData(generators: NPowerPlanner.IGenerator[]): Promise<NPowerPlanner.IComponent[]> {
    const componentsClasses = uniq(generators.map(({ blueprint }) => {
      return blueprint.map(({ component }) => component)
    })).flat()

    componentsClasses.push(WATER_CLASS, POWER_SHARD)

    const result = Promise.all(componentsClasses.map(async (componentClass) => {
      const component = await Component.findBy('class', componentClass)

      if (component === null) {
        throw new Error(`Could not find ${componentClass} component`)
      }

      await component.load('name')

      return {
        name: component.name.value,
        class: component.class,
        icon: await this.saveIcon(component.icon),
      }
    }))

    consola.success(`${chalk.bold.cyanBright('Components')} data generated`)

    return result
  }
}
