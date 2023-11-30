import {
  BaseModel,
  column,
  HasMany,
  hasMany,
  hasOne,
  HasOne,
} from '@ioc:Adonis/Lucid/Orm'

import Locale from './Locale'
import Recipe from './Recipe'

export default class Extractor extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string

  @column()
  public class: string

  @column()
  public nameLocale: string

  @column()
  public icon: string

  @column()
  public energyConsumption: number

  @column()
  public energyExponent: number

  @hasOne(() => Locale)
  public name: HasOne<typeof Locale>

  @hasMany(() => Recipe)
  public recipes: HasMany<typeof Recipe>
}
