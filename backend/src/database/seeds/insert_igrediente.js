exports.seed = function(knex) {
  return knex('ingrediente').del()
    .then(function () {
      return knex('ingrediente').insert([
        { id:1, nome: 'Leite', id_tipo_unidade: 1, sem_medida: false, derivado_leite: true, gluten: false,id_tipo_ingrediente:7 },
        { id:2, nome: 'Manteiga', id_tipo_unidade: 2, sem_medida: false, derivado_leite: true, gluten: false,id_tipo_ingrediente:7 },
        { id:3, nome: 'Ovo', id_tipo_unidade: 3, sem_medida: false, derivado_leite: false, gluten: false,id_tipo_ingrediente:9 },
        { id:4, nome: 'Farinha de Trigo', id_tipo_unidade: 2, sem_medida: false, derivado_leite: false, gluten: true,id_tipo_ingrediente:9 },
        { id:5, nome: 'Amido de Milho', id_tipo_unidade: 2, sem_medida: false, derivado_leite: false, gluten: false,id_tipo_ingrediente:9 },
        { id:6, nome: 'Sal', id_tipo_unidade: 2, sem_medida: true, derivado_leite: false, gluten: false,id_tipo_ingrediente:2 },
        { id:7, nome: 'Açúcar', id_tipo_unidade: 2, sem_medida: true, derivado_leite: false, gluten: false,id_tipo_ingrediente:10 },
        { id:8, nome: 'Farinha de Mandioca', id_tipo_unidade: 2, sem_medida: false, derivado_leite: false, gluten: false,id_tipo_ingrediente:9 },
        { id:9, nome: 'Farinha de Rosca', id_tipo_unidade: 2, sem_medida: false, derivado_leite: false, gluten: true,id_tipo_ingrediente:9 },
        { id:10, nome: 'Fubá', id_tipo_unidade: 2, sem_medida: false, derivado_leite: false, gluten: false,id_tipo_ingrediente:9 },
        { id:11, nome: 'Achocolatado', id_tipo_unidade: 2, sem_medida: true, derivado_leite: false, gluten: true,id_tipo_ingrediente:9 },
        { id:12, nome: 'Arroz', id_tipo_unidade: 2, sem_medida: false, derivado_leite: false, gluten: false,id_tipo_ingrediente:1 },
        { id:13, nome: 'Feijão', id_tipo_unidade: 2, sem_medida: false, derivado_leite: false, gluten: false,id_tipo_ingrediente:1 },
        { id:14, nome: 'Mel', id_tipo_unidade: 2, sem_medida: false, derivado_leite: false, gluten: false,id_tipo_ingrediente:10 },
        { id:15, nome: 'Aveia', id_tipo_unidade: 2, sem_medida: false, derivado_leite: false, gluten: false,id_tipo_ingrediente:9 },
        { id:16, nome: 'Polvilho', id_tipo_unidade: 2, sem_medida: false, derivado_leite: false, gluten: false,id_tipo_ingrediente:9 },
        { id:17, nome: 'Coco Ralado', id_tipo_unidade: 2, sem_medida: false, derivado_leite: false, gluten: false,id_tipo_ingrediente:9 },
        { id:18, nome: 'Fermento em pó', id_tipo_unidade: 2, sem_medida: false, derivado_leite: false, gluten: false,id_tipo_ingrediente:9 },
        { id:19, nome: 'Abacaxi', id_tipo_unidade: 3, sem_medida: false, derivado_leite: false, gluten: false,id_tipo_ingrediente:3 },
        { id:20, nome: 'Leite Condensado', id_tipo_unidade: 1, sem_medida: false, derivado_leite: true, gluten: false, id_tipo_ingrediente:7},
        { id:21, nome: 'Chocolate Granulado', id_tipo_unidade: 2, sem_medida: false, derivado_leite: true, gluten: false, id_tipo_ingrediente:7 },
        { id:22, nome: 'Água', id_tipo_unidade: 1, sem_medida: true, derivado_leite: false, gluten: false,id_tipo_ingrediente:8 }
      ]);
    });
};