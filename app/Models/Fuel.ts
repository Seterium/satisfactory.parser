import type { HasOne } from '@ioc:Adonis/Lucid/Orm'

import { BaseModel, column, hasOne } from '@ioc:Adonis/Lucid/Orm'

import Component from './Component'

export default class Fuel extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public generatorId: number

  @column()
  public componentId: number

  @column()
  public wasteId: number | null

  @column()
  public wasteAmount: number | null

  @column()
  public energy: number

  @hasOne(() => Component, {
    foreignKey: 'id',
    localKey: 'componentId',
  })
  public component: HasOne<typeof Component>

  @hasOne(() => Component, {
    foreignKey: 'id',
    localKey: 'wasteId',
  })
  public waste: HasOne<typeof Component>
}
