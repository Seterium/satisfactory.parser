import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'blueprint_components'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('blueprint_id').unsigned().references('blueprints.id').onDelete('CASCADE')
      table.integer('component_id').unsigned().references('components.id').onDelete('CASCADE')
      table.integer('amount').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
