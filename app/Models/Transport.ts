import {
  BaseModel,
  column,
  HasOne,
  hasOne,
} from '@ioc:Adonis/Lucid/Orm'
import Blueprint from './Blueprint'

export default class Transport extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public class: string

  @column()
  public nameLocaleKey: string

  @column()
  public blueprintId: number

  @column()
  public icon: string

  @column()
  public speed: number

  @hasOne(() => Blueprint)
  public blueprint: HasOne<typeof Blueprint>
}
