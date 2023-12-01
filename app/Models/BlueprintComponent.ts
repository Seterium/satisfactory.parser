import {
  BaseModel,
  column,
  HasOne,
  hasOne,
} from '@ioc:Adonis/Lucid/Orm'

import Component from './Component'

export default class BlueprintComponent extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public blueprintId: number

  @column()
  public componentId: number

  @column()
  public amount: number

  @hasOne(() => Component)
  public component: HasOne<typeof Component>
}
