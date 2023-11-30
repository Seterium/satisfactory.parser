import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Locale extends BaseModel {
  @column()
  public id: number

  @column({ isPrimary: true })
  public key: string

  @column()
  public value: string
}
