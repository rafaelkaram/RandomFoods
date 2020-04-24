exports.up = function(knex) {
    return knex.schema.createTable('comentario', function (table) {
        table.increments();
        table.integer('id_usuario').notNullable();
        table.integer('id_receita').notNullable();
        table.integer('id_pai').notNullable();
        table.text('valor').notNullable();
        table.datetime('data').notNullable().defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('comentario');
};