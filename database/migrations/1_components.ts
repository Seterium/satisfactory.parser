import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'components'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('class').notNullable().unique()
      table.enum('type', ['RF_SOLID', 'RF_LIQUID', 'RF_GAS']).notNullable()
      table.string('name_locale_key').notNullable()
      table.string('icon').notNullable()
      table.integer('sink_points').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
