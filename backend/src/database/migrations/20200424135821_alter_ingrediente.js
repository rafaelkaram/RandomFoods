exports.up = function(knex) {
    return knex.schema.table('ingrediente', function (table) {
        table.foreign('id_tipo_unidade').references('id').inTable('tipo_unidade');
    });
};

exports.down = function(knex) {
    return knex.schema.table('ingrediente', function (table) {
        table.dropForeign(['id_tipo_unidade']);
    });
};