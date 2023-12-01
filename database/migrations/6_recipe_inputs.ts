import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'recipe_inputs'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('recipe_id').unsigned().references('recipes.id').onDelete('CASCADE')
      table.integer('resource_id').unsigned().references('components.id').onDelete('CASCADE')
      table.integer('amount').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
