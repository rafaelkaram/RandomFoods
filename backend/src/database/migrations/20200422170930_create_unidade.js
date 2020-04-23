exports.up = function(knex) {
    return knex.schema.createTable('unidade', function (table) {
        table.increments();
        table.string('nome', 30).notNullable();
        table.integer('id_tipo_unidade').notNullable();
        table.decimal('taxa_conversao').notNullable();

        table.foreign('id_tipo_unidade').references('id').inTable('tipo_unidade');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('unidade');
};