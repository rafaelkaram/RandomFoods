exports.up = function(knex) {
    return knex.schema.createTable('tipo_unidade', function (table) {
        table.increments();
        table.string('nome', 30).notNullable();
        table.integer('id_unidade').notNullable();

        table.unique('nome');
        table.foreign('id_unidade').references('id').inTable('unidade');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('tipo_unidade');
};