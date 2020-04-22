exports.up = function(knex) {
    return knex.schema.createTable('tipo_unidade', function (table) {
        table.increments();
        table.string('nome', 30).notNullable();
        table.decimal('taxa_conversao').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('tipo_unidade');
};