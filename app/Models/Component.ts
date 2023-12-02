import type { HasOne } from '@ioc:Adonis/Lucid/Orm'

import { BaseModel, column, hasOne } from '@ioc:Adonis/Lucid/Orm'

import Locale from './Locale'

export default class Component extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public class: string

  @column()
  public nameLocaleId: number

  @column()
  public type: 'RF_SOLID' | 'RF_LIQUID' | 'RF_GAS'

  @column()
  public sinkPoints: number

  @column()
  public icon: string

  @hasOne(() => Locale)
  public name: HasOne<typeof Locale>
}
