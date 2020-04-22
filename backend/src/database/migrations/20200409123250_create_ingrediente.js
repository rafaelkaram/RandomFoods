exports.up = function(knex) {
    return knex.schema.createTable('ingrediente', function (table) {
        table.increments();
        table.string('nome', 100).notNullable();
        table.integer('id_unidade');
        table.boolean('derivado_leite').notNullable();
        table.boolean('gluten').notNullable();
  
        table.foreign('id_unidade').references('id').inTable('unidade');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('ingrediente');  
};
