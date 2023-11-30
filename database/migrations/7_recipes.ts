import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'recipes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('class').notNullable()
      table.integer('name_locale_id').unsigned().references('locales.id').notNullable()
      table.boolean('is_alt').notNullable()
      table.integer('manufacturer').unsigned().references('manufacturers.id')
      table.integer('duration').notNullable()
      table.integer('energy').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
