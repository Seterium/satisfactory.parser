import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'transports'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('class').notNullable().unique()
      table.integer('name_locale_id').unsigned().references('locales.id').notNullable()
      table.string('icon').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
