exports.up = function(knex) {
  return knex.schema.table('receita_ingrediente', function (table) {
    table.foreign('id_ingrediente').references('id').inTable('usuario');
    table.foreign('id_receita').references('id').inTable('receita');
    table.foreign('id_unidade').references('id').inTable('unidade');
  });
};

exports.down = function(knex) {
  return knex.schema.table('receita_ingrediente', function (table) {
      table.dropForeign(['id_ingrediente', 'id_receita', 'id_unidade']);
  });
};