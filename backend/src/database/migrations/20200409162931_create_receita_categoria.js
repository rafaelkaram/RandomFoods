exports.up = function(knex) {
    return knex.schema.createTable('receita_categoria', function (table) {
        table.increments();
        table.integer('id_receita').notNullable();
        table.integer('id_categoria').notNullable();

        table.foreign('id_receita').references('id').inTable('receita');
        table.foreign('id_categoria').references('id').inTable('categoria');
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable('receita_categoria');
};