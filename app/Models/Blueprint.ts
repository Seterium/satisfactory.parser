import type { HasMany } from '@ioc:Adonis/Lucid/Orm'

import { BaseModel, column, hasMany } from '@ioc:Adonis/Lucid/Orm'

import BlueprintComponent from './BlueprintComponent'

export default class Blueprint extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public class: string

  @hasMany(() => BlueprintComponent, {
    localKey: 'id',
    foreignKey: 'blueprintId',
  })
  public components: HasMany<typeof BlueprintComponent>
}
