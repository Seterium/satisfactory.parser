import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'recipes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('class').notNullable()
      table.string('name_locale_key').nullable()
      table.boolean('is_alt').notNullable()
      table.integer('manufacturer_id').notNullable().unsigned().references('manufacturers.id')
      table.integer('power_consumption').notNullable()
      table.integer('duration').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
