exports.seed = function(knex) {
  return knex('tipo_ingrediente').del()
    .then(function () {
      return knex('tipo_ingrediente').insert([
        { id: 1, nome: 'Grão' },
        { id: 2, nome: 'Tempero' },
        { id: 3, nome: 'Salada' },
        { id: 4, nome: 'Vegetal' },
        { id: 5, nome: 'Legume' },
        { id: 6, nome: 'Carne' },
      ]);
    });
};