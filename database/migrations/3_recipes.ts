import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'recipes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('class').notNullable().unique()
      table.integer('name_locale_id').nullable().unsigned().references('locales.id')
      table.boolean('is_alt').notNullable()
      table.integer('manufacturer_id').nullable().unsigned().references('manufacturers.id')
      table.integer('duration').nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
