import {
  BaseModel,
  column,
} from '@ioc:Adonis/Lucid/Orm'

export default class Component extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public class: string

  @column()
  public nameLocaleKey: string

  @column()
  public type: 'RF_SOLID' | 'RF_LIQUID' | 'RF_GAS'

  @column()
  public sinkPoints: number

  @column()
  public icon: string
}
