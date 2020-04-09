exports.up = function(knex) {
    return knex.schema.createTable('usuario', function (table) {
        table.increments();
        table.string('nome', 100).notNullable();
        table.string('email', 30).notNullable();
        table.string('senha', 16).notNullable();
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable('usuario');
};
