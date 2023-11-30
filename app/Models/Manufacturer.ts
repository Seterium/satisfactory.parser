import {
  BaseModel,
  column,
  hasOne,
  HasOne,
} from '@ioc:Adonis/Lucid/Orm'

import Locale from './Locale'

export default class Manufacturer extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string

  @column()
  public class: string

  @column()
  public nameLocale: string

  @column()
  public icon: string

  @hasOne(() => Locale)
  public name: HasOne<typeof Locale>
}
