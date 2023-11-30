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
import Recipe from './Recipe'

export default class Generator extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public class: string

  @column()
  public nameLocaleId: number

  @column()
  public recipeId: number

  @column()
  public icon: string

  @column()
  public power: number

  @column()
  public waterConsumption: number

  @hasOne(() => Locale)
  public name: HasOne<typeof Locale>

  @hasMany(() => Fuel)
  public fuels: HasMany<typeof Fuel>

  @hasOne(() => Recipe)
  public recipe: HasOne<typeof Recipe>
}
