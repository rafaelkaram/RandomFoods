exports.up = function(knex) {    
    return knex.schema.alterTable('unidade', function (table) {
        table.foreign('id_tipo_unidade').references('id').inTable('tipo_unidade');
        table.foreign('id_ingrediente').references('id').inTable('ingrediente');
    });
};

exports.down = function(knex) {
  
};