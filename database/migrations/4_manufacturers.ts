import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'manufacturers'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('class').notNullable()
      table.integer('name_locale_id').notNullable().unsigned().references('locales.id')
        .onDelete('CASCADE')
      table.integer('blueprint_id').notNullable().unsigned().references('blueprints.id')
        .onDelete('CASCADE')
      table.string('icon').notNullable()
      table.integer('power_consumption').notNullable()
      table.string('power_exponent').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
