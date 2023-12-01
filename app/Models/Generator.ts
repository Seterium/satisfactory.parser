import {
  BaseModel,
  column,
  HasMany,
  hasMany,
  hasOne,
  HasOne,
} from '@ioc:Adonis/Lucid/Orm'

import Fuel from './Fuel'
import Blueprint from './Blueprint'

export default class Generator extends BaseModel {
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
  public power: number

  @column()
  public waterConsumption: number

  @hasMany(() => Fuel)
  public fuels: HasMany<typeof Fuel>

  @hasOne(() => Blueprint)
  public blueprint: HasOne<typeof Blueprint>
}
