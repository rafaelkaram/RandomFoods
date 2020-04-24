exports.up = function(knex) {
  return knex.schema.table('receita_categoria', function (table) {
    table.foreign('id_receita').references('id').inTable('receita');
    table.foreign('id_categoria').references('id').inTable('categoria');
  });
};

exports.down = function(knex) {
  return knex.schema.table('receita_categoria', function (table) {
    table.dropForeign(['id_receita', 'id_categoria']);
  });
};