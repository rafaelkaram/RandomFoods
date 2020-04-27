exports.up = function(knex) {
    return knex.schema.createTable('ingrediente', function (table) {
        table.increments();
        table.string('nome', 100).notNullable();
        table.integer('id_tipo_unidade');
        table.boolean('sem_medida').notNullable().defaultTo(false);
        table.boolean('derivado_leite').notNullable().defaulTo(false);
        table.boolean('gluten').notNullable().defaultTo(false);
        // adicionar outros tipos
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('ingrediente');
};