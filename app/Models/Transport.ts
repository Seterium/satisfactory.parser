import {
  BaseModel,
  column,
  HasOne,
  hasOne,
} from '@ioc:Adonis/Lucid/Orm'

import Locale from './Locale'

export default class Transport extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @hasOne(() => Locale)
  public name: HasOne<typeof Locale>
}
