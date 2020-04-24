exports.up = function(knex) {
    return knex.schema.createTable('receita_categoria', function (table) {
        table.increments();
        table.integer('id_receita').notNullable();
        table.integer('id_categoria').notNullable();
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable('receita_categoria');
};