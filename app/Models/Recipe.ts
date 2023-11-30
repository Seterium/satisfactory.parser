import {
  BaseModel,
  column,
  HasOne,
  hasOne,
  HasMany,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm'

import RecipeInput from './RecipeInput'
import RecipeOutput from './RecipeOutput'
import Locale from './Locale'

export default class Recipe extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public class: string

  @column()
  public nameLocale: string

  @column()
  public isAlt: boolean

  @column()
  public buildingId: number

  @column()
  public duration: number

  @hasMany(() => RecipeInput)
  public inputs: HasMany<typeof RecipeInput>

  @hasMany(() => RecipeOutput)
  public outputs: HasMany<typeof RecipeOutput>

  @hasOne(() => Locale)
  public name: HasOne<typeof Locale>
}
