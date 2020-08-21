exports.seed = function(knex) {
  return knex('categoria').del()
    .then(function () {
      return knex('categoria').insert([
        { id: 1, nome: 'Diet' },
        { id: 2, nome: 'Light' },
        { id: 3, nome: 'Fitness' },
        { id: 4, nome: 'Vegana' },
        { id: 5, nome: 'Vegetariana' }
      ]);
    });
};