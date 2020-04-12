exports.up = function(knex) {
    return knex.schema.createTable('usuario', function (table) {
        table.increments();
        table.string('nome', 100).notNullable();
        table.string('email', 30).notNullable();
        table.string('senha', 16).notNullable();
        table.datetime('data_cadastro').notNullable().defaultTo(knex.fn.now());
        table.datetime('data_ultimo_acesso').notNullable().defaultTo(knex.fn.now());
        table.datetime('data_ultima_acao');
        table.boolean('ativo').notNullable().defaultTo(true);

        table.unique('email');
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable('usuario');
};
