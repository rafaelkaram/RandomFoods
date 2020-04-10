exports.up = function(knex) {
    return knex.schema.createTable('comentario', function (table) {
        table.increments();
        table.integer('id_usuario').notNullable();
        table.integer('id_receita').notNullable();
        table.integer('id_comentario_pai').notNullable();
        table.text('valor').notNullable();

        table.foreign('id_usuario').references('id').inTable('');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('comentario');  
};