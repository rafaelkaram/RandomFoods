exports.seed = function(knex) {
  return knex('ingrediente').del()
    .then(function () {
      return knex('ingrediente').insert([
        { nome: 'Leite', id_tipo_unidade: 1, sem_medida: false, derivado_leite: true, gluten: false },
        { nome: 'Manteiga', id_tipo_unidade: 2, sem_medida: false, derivado_leite: false, gluten: false },
        { nome: 'Ovo', id_tipo_unidade: 3, sem_medida: false, derivado_leite: false, gluten: false },
        { nome: 'Farinha de Trigo', id_tipo_unidade: 2, sem_medida: false, derivado_leite: false, gluten: true },
        { nome: 'Amido de Milho', id_tipo_unidade: 2, sem_medida: false, derivado_leite: false, gluten: false },
        { nome: 'Sal', id_tipo_unidade: 2, sem_medida: true, derivado_leite: false, gluten: false },
        { nome: 'Açúcar', id_tipo_unidade: 2, sem_medida: true, derivado_leite: false, gluten: false },
        { nome: 'Farinha de Mandioca', id_tipo_unidade: 2, sem_medida: false, derivado_leite: false, gluten: false },
        { nome: 'Farinha de Rosca', id_tipo_unidade: 2, sem_medida: false, derivado_leite: false, gluten: true },
        { nome: 'Fubá', id_tipo_unidade: 2, sem_medida: false, derivado_leite: false, gluten: false },
        { nome: 'Achocolatado', id_tipo_unidade: 2, sem_medida: true, derivado_leite: false, gluten: true },
        { nome: 'Arroz', id_tipo_unidade: 2, sem_medida: false, derivado_leite: false, gluten: false },
        { nome: 'Feijão', id_tipo_unidade: 2, sem_medida: false, derivado_leite: false, gluten: false },
        { nome: 'Mel', id_tipo_unidade: 2, sem_medida: false, derivado_leite: false, gluten: false },
        { nome: 'Aveia', id_tipo_unidade: 2, sem_medida: false, derivado_leite: false, gluten: false },
        { nome: 'Polvilho', id_tipo_unidade: 2, sem_medida: false, derivado_leite: false, gluten: false },
        { nome: 'Coco Ralado', id_tipo_unidade: 2, sem_medida: false, derivado_leite: false, gluten: false }
      ]);
    });
};