import type { HasMany, HasOne } from '@ioc:Adonis/Lucid/Orm'

import { BaseModel, column, hasMany, hasOne } from '@ioc:Adonis/Lucid/Orm'

import RecipeInput from './RecipeInput'
import RecipeOutput from './RecipeOutput'
import Locale from './Locale'

export default class Recipe extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public class: string

  @column()
  public nameLocaleId: number

  @column()
  public isAlt: boolean

  @column()
  public manufacturerId: number

  @column()
  public powerConsumption: number

  @column()
  public duration: number

  @hasMany(() => RecipeInput)
  public inputs: HasMany<typeof RecipeInput>

  @hasMany(() => RecipeOutput)
  public outputs: HasMany<typeof RecipeOutput>

  @hasOne(() => Locale)
  public name: HasOne<typeof Locale>
}
