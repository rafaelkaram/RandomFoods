exports.up = function(knex) {
    knex.schema.alterTable('ingrediente', function (table) {
        table.foreign('id_tipo_unidade').references('id').inTable('tipo_unidade');
    });
    
    knex.schema.alterTable('receita_ingrediente', function (table) {
        table.foreign('id_ingrediente').references('id').inTable('usuario');
        table.foreign('id_receita').references('id').inTable('receita');
        table.foreign('id_unidade').references('id').inTable('unidade');
    });
    
    return knex.schema.alterTable('unidade', function (table) {
        table.foreign('id_tipo_unidade').references('id').inTable('tipo_unidade');
        table.foreign('id_ingrediente').references('id').inTable('ingrediente');
    });
};

exports.down = function(knex) {
  
};