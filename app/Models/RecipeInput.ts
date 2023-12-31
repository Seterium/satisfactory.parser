import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class RecipeInput extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public recipeId: number

  @column()
  public resourceId: number

  @column()
  public amount: number
}
