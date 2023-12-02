import type { HasOne, HasMany } from '@ioc:Adonis/Lucid/Orm'

import { BaseModel, column, hasOne, hasMany } from '@ioc:Adonis/Lucid/Orm'

import Fuel from './Fuel'
import Blueprint from './Blueprint'
import Locale from './Locale'

export default class Generator extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public class: string

  @column()
  public nameLocaleId: number

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

  @hasOne(() => Locale)
  public name: HasOne<typeof Locale>
}
