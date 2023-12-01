import {
  BaseModel,
  column,
  HasMany,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm'

import RecipeInput from './RecipeInput'
import RecipeOutput from './RecipeOutput'

export default class Recipe extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public class: string

  @column()
  public nameLocaleKey: number | null

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
}
