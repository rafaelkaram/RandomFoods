exports.up = function(knex) {
    return knex.schema.alterTable('avaliacao', function (table) {
        table.foreign('id_usuario').references('id').inTable('usuario');
        table.foreign('id_receita').references('id').inTable('receita');
    });
};

exports.down = function(knex) {
  
};