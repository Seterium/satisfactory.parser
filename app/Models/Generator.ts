import {
  BaseModel,
  column,
  HasMany,
  hasMany,
  hasOne,
  HasOne,
} from '@ioc:Adonis/Lucid/Orm'

import Locale from './Locale'
import Fuel from './Fuel'

export default class Generator extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public class: string

  @column()
  public nameLocaleId: number

  @column()
  public icon: string

  @column()
  public power: number

  @column()
  public waterConsumption: number

  @hasOne(() => Locale)
  public name: HasOne<typeof Locale>

  @hasMany(() => Fuel)
  public fuel: HasMany<typeof Fuel>
}
