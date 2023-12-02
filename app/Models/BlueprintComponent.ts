import type { HasOne } from '@ioc:Adonis/Lucid/Orm'

import { BaseModel, column, hasOne } from '@ioc:Adonis/Lucid/Orm'

import Component from './Component'
import Blueprint from './Blueprint'

export default class BlueprintComponent extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public blueprintId: number

  @column()
  public componentId: number

  @column()
  public amount: number

  @hasOne(() => Blueprint, {
    foreignKey: 'id',
    localKey: 'blueprintId',
  })
  public blueprint: HasOne<typeof Blueprint>

  @hasOne(() => Component, {
    foreignKey: 'id',
    localKey: 'componentId',
  })
  public component: HasOne<typeof Component>
}
