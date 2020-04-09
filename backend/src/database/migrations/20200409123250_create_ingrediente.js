exports.up = function(knex) {
    return knex.schema.createTable('ingrediente', function (table) {
        table.increments();
        table.string('nome', 100).notNullable();
        table.string('unidade', 10).notNullable();
        table.boolean('derivado_leite').notNullable();
        table.boolean('gluten').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('ingrediente');
};