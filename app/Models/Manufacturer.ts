import {
  BaseModel,
  column,
  hasOne,
  HasOne,
} from '@ioc:Adonis/Lucid/Orm'

import Blueprint from './Blueprint'

export default class Manufacturer extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public class: string

  @column()
  public nameLocaleKey: string

  @column()
  public blueprintId: number

  @column()
  public icon: string

  @column()
  public powerConsumption: number

  @column()
  public powerExponent: string

  @hasOne(() => Blueprint)
  public blueprint: HasOne<typeof Blueprint>
}
