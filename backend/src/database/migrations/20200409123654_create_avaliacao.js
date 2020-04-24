exports.up = function(knex) {
    return knex.schema.createTable('avaliacao', function (table) {
        table.increments();
        table.integer('id_usuario').notNullable();
        table.integer('id_receita').notNullable();
        table.integer('valor').notNullable();
        table.datetime('data').notNullable().defaultTo(knex.fn.now());

        table.unique(['id_usuario', 'id_receita']);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('avaliacao');
};