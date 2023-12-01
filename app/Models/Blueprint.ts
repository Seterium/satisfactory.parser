import {
  BaseModel,
  column,
  HasMany,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm'
import BlueprintComponent from './BlueprintComponent'

export default class Blueprint extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public class: string

  @hasMany(() => BlueprintComponent)
  public components: HasMany<typeof BlueprintComponent>
}
