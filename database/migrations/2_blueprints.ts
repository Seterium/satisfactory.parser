import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'blueprints'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('class')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
