exports.up = function(knex) {
    knex.schema.alterTable('avaliacao', function (table) {
        table.foreign('id_usuario').references('id').inTable('usuario');
        table.foreign('id_receita').references('id').inTable('receita');
    });

    knex.schema.alterTable('comentario', function (table) {
        table.foreign('id_usuario').references('id').inTable('usuario');
        table.foreign('id_receita').references('id').inTable('receita');
        table.foreign('id_pai').references('id').inTable('comentario');
    });

    knex.schema.alterTable('ingrediente', function (table) {
        table.foreign('id_tipo_unidade').references('id').inTable('tipo_unidade');
        table.foreign('id_tipo_ingrediente').references('id').inTable('tipo_ingrediente');
    });

    knex.schema.alterTable('receita', function (table) {
        table.foreign('id_usuario').references('id').inTable('usuario');
    });

    knex.schema.alterTable('receita_categoria', function (table) {
        table.foreign('id_receita').references('id').inTable('receita');
        table.foreign('id_categoria').references('id').inTable('categoria');
    });
    
    knex.schema.alterTable('receita_ingrediente', function (table) {
        table.foreign('id_ingrediente').references('id').inTable('usuario');
        table.foreign('id_receita').references('id').inTable('receita');
        table.foreign('id_unidade').references('id').inTable('unidade');
    });
    
    return knex.schema.alterTable('unidade', function (table) {
        table.foreign('id_tipo_unidade').references('id').inTable('tipo_unidade');
        table.foreign('id_ingrediente').references('id').inTable('ingrediente');
    });
};

exports.down = function(knex) {
  
};