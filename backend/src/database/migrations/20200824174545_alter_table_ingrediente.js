exports.up = function(knex) {
    return knex.schema.alterTable('ingrediente', function (table) {
        table.foreign('id_tipo_unidade').references('id').inTable('tipo_unidade');
        table.foreign('id_tipo_ingrediente').references('id').inTable('tipo_ingrediente');
    });
};

exports.down = function(knex) {
  
};