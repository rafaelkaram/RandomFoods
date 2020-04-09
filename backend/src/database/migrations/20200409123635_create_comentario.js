exports.up = function(knex) {
    return knex.schema.createTable('comentario', function (table) {
        table.increments();
        table.integer('id_usuario').notNullable();
        table.integer('id_receita').notNullable();
        table.integer('id_comentario_pai').notNullable();
        table.text('valor').notNullable();
        table.datetime('data').notNullable().defaultTo(knex.fn.now());

        table.foreign('id_usuario').references('id').inTable('usuario');
        table.foreign('id_receita').references('id').inTable('receita');
        table.foreign('id_comentario_pai').references('id').inTable('comentario');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('comentario');
};