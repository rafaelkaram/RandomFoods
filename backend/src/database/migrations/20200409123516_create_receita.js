exports.up = function(knex) {
    return knex.schema.createTable('receita', function (table) {
        table.increments();
        table.integer('id_usuario');defaultTo(null);
        table.string('nome', 100).notNullable();
        table.text('descricao').notNullable();
        table.enu('tipo', ['doce', 'salgado']).notNullable();
        table.datetime('data_cadastro').notNullable().defaultTo(knex.fn.now());
        table.boolean('ativa').notNullable().defaultTo(true);

        table.foreign('id_usuario').references('id').inTable('usuario');
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable('receita');
};