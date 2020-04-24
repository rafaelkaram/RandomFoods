exports.up = function(knex) {
    return knex.schema.table('receita', function (table) {
        table.foreign('id_usuario').references('id').inTable('usuario');
    });
};

exports.down = function(knex) {
    return knex.schema.table('receita', function (table) {
        table.dropForeign(['id_usuario']);
    });
};