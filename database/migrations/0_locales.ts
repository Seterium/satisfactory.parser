import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'locales'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('key').notNullable().unique()
      table.text('value').nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
