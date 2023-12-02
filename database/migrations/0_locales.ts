import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'locales'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('key').notNullable()
      table.string('value').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
