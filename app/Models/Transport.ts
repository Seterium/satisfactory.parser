import type { HasOne } from '@ioc:Adonis/Lucid/Orm'

import { BaseModel, column, hasOne } from '@ioc:Adonis/Lucid/Orm'

import Blueprint from './Blueprint'
import Locale from './Locale'

export default class Transport extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public class: string

  @column()
  public nameLocaleId: number

  @column()
  public blueprintId: number

  @column()
  public icon: string

  @column()
  public speed: number

  @hasOne(() => Blueprint)
  public blueprint: HasOne<typeof Blueprint>

  @hasOne(() => Locale)
  public name: HasOne<typeof Locale>
}
