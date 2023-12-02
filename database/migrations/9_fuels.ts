import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'fuels'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('generator_id').notNullable().unsigned().references('generators.id')
        .onDelete('CASCADE')
      table.integer('component_id').notNullable().unsigned().references('components.id')
        .onDelete('CASCADE')
      table.integer('waste_id').nullable().unsigned().references('components.id')
        .onDelete('CASCADE')
      table.integer('waste_amount').nullable()
      table.integer('energy').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
