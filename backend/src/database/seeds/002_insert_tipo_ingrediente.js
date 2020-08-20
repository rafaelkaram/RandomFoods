exports.seed = function(knex) {
  return knex('tipo_ingrediente').del()
    .then(function () {
      return knex('tipo_ingrediente').insert([
        { id: 1, nome: 'Grão' },
        { id: 2, nome: 'Tempero' },
        { id: 3, nome: 'Fruta' },
        { id: 4, nome: 'Vegetal' },
        { id: 5, nome: 'Legume' },
        { id: 6, nome: 'Carne' },
        { id: 7, nome: 'Lacticínios' },
        { id: 8, nome: 'Outros' },
        { id: 9, nome: 'Confeitaria' },
        { id: 10, nome: 'Massas' },
        { id: 11, nome: 'Óleos' },
        { id: 12, nome: 'Molhos' }
      ]);
    });
};
