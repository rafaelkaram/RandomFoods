exports.up = function(knex) {
    return knex.schema.alterTable('receita', function (table) {
        table.foreign('id_usuario').references('id').inTable('usuario');
    });
};

exports.down = function(knex) {
  
};