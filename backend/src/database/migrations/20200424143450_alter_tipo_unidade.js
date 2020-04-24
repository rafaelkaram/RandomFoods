exports.up = function(knex) {
    return knex.schema.table('tipo_unidade', function (table) {
        table.foreign('id_unidade').references('id').inTable('unidade');
  });
};

exports.down = function(knex) {
    return knex.schema.table('tipo_unidade', function (table) {
        table.dropForeign(['id_unidade']);
  });
};