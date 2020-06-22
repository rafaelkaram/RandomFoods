exports.up = function(knex) {
  return knex.schema.alterTable('receita', function (table) {
      table.decimal('nota');
      table.integer('num_notas').notNullable().defaultTo(0);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('receita');
};