exports.up = function(knex) {
    return knex.schema.createTable('unidade', function (table) {
        table.increments();
        table.string('nome', 30).notNullable();
        table.string('sigla', 30).notNullable();
        table.integer('id_tipo_unidade').notNullable();
        table.boolean('si').notNullable().defaultTo(false);
        table.decimal('taxa_conversao').notNullable();

        table.unique(['nome', 'id_tipo_unidade']);
        table.unique(['sigla', 'id_tipo_unidade']);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('unidade');
};