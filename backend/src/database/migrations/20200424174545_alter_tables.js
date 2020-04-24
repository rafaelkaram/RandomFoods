exports.up = function(knex) {
    knex.schema.alterTable('ingrediente', function (table) {
        table.foreign('id_tipo_unidade').references('id').inTable('tipo_unidade');
    });
    
    knex.schema.alterTable('receita_ingrediente', function (table) {
        table.foreign('id_unidade').references('id').inTable('unidade');
    });
    
    return knex.schema.alterTable('unidade', function (table) {
        table.foreign('id_tipo_unidade').references('id').inTable('tipo_unidade');
    });
};

exports.down = function(knex) {
  
};