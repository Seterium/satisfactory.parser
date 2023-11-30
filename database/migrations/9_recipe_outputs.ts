import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'recipe_outputs'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('recipe').unsigned().references('recipes.id')
      table.integer('component').unsigned().references('components.id')
      table.integer('count').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
