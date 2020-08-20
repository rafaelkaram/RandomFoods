exports.up = function(knex) {
    return knex.schema.alterTable('comentario', function (table) {
        table.foreign('id_usuario').references('id').inTable('usuario');
        table.foreign('id_receita').references('id').inTable('receita');
        table.foreign('id_pai').references('id').inTable('comentario');
    });
};

exports.down = function(knex) {
  
};