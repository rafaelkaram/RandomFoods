exports.up = function(knex) {
    return knex.schema.createTable('receita_ingrediente', function (table) {
        table.increments();
        table.integer('id_ingrediente').notNullable();
        table.integer('id_receita').notNullable();
        table.integer('id_unidade');
        table.decimal('quantidade').notNullable();
        
        table.unique(['id_ingrediente', 'id_receita']);
        table.foreign('id_ingrediente').references('id').inTable('usuario');
        table.foreign('id_receita').references('id').inTable('receita');
        table.foreign('id_unidade').references('id').inTable('unidade');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('receita_ingrediente');
};