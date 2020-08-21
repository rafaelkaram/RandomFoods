exports.up = function(knex) {
    return knex.schema.alterTable('receita_ingrediente', function (table) {
        table.foreign('id_ingrediente').references('id').inTable('ingrediente');
        table.foreign('id_receita').references('id').inTable('receita');
        table.foreign('id_unidade').references('id').inTable('unidade');
    });
};

exports.down = function(knex) {
  
};