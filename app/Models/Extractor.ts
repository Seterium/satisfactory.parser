import {
  BaseModel,
  column,
  HasOne,
  hasOne,
} from '@ioc:Adonis/Lucid/Orm'

import Blueprint from './Blueprint'

export default class Extractor extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string

  @column()
  public class: string

  @column()
  public nameLocaleKey: string

  @column()
  public icon: string

  @column()
  public blueprintId: number

  @column()
  public powerConsumption: number

  @column()
  public powerExponent: number

  @column()
  public extractionFactor: number

  @hasOne(() => Blueprint)
  public blueprint: HasOne<typeof Blueprint>
}
