import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'generators'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('class').notNullable().unique()
      table.integer('name_locale_id').notNullable().unsigned().references('locales.id')
        .onDelete('CASCADE')
      table.integer('blueprint_id').notNullable().unsigned().references('blueprints.id')
        .onDelete('CASCADE')
      table.string('icon').notNullable()
      table.integer('water_consumption').notNullable()
      table.integer('power').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
