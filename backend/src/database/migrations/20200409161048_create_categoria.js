exports.up = function(knex) {
    return knex.schema.createTable('categoria', function (table) {
        table.increments();
        table.string('nome', 15).notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('categoria');
};

/**
 * Vegan
 * Vegetariana
 * Light
 * Diet
 * Detox
 * Fitness
 */