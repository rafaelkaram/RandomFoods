exports.seed = function(knex) {
  return knex('tipo_unidade').del()
    .then(function () {
      return knex('tipo_unidade').insert([
        { id: 1, nome: 'VOLUME' },
        { id: 2, nome: 'PÈSO' },
        { id: 3, nome: 'UNIDADE' }
      ]);
    });
};