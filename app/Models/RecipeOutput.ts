import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class RecipeOutput extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public recipeId: number

  @column()
  public productId: number

  @column()
  public amount: number
}
