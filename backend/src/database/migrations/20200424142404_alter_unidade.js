exports.up = function(knex) {
    return knex.schema.table('unidade', function (table) {
        table.foreign('id_tipo_unidade').references('id').inTable('tipo_unidade');
    });
};

exports.down = function(knex) {
    return knex.schema.table('unidade', function (table) {
        table.dropForeign(['id_tipo_unidade']);
    });
};