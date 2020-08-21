
exports.seed = function(knex) {
  return knex('unidade').del()
    .then(function () {
      return knex('unidade').insert([
        {
          id: 1,
          nome: 'Litro',
          sigla: 'L',
          taxa_conversao: 1,
          id_tipo_unidade: 1  
        },
        {
          id: 2,
          nome: 'Mililitro',
          sigla: 'Ml',
          taxa_conversao: 0.001,
          id_tipo_unidade: 1   
        },
        {
          id: 3,
          nome: 'Grama',
          sigla: 'g',
          taxa_conversao: 1,
          id_tipo_unidade: 2    
        },
        {
          id: 4,
          nome: 'Miligrama',
          sigla: 'Mg',
          taxa_conversao: 0.001,
          id_tipo_unidade: 2    
        },
        {
          id: 5,
          nome: 'Quilograma',
          sigla: 'Kg',
          taxa_conversao: 1000,
          id_tipo_unidade: 2     
        },
        {
          id: 6,
          nome: 'Unidade',
          sigla: 'U',
          taxa_conversao: 1,
          id_tipo_unidade: 3
        },
        {
          id: 7,
          nome: 'Xicara (Farinha de Trigo)',
          sigla: 'Xicara',
          taxa_conversao: 120,
          id_tipo_unidade: 2,
          id_ingrediente: 4
        },
        {
          id: 8,
          nome: 'Colher de Sopa (Farinha de Trigo)',
          sigla: 'Colher de Sopa',
          taxa_conversao: 7.5,
          id_tipo_unidade: 2,
          id_ingrediente: 4
        },
        {
          id: 9,
          nome: 'Colher de Chá (Farinha de Trigo)',
          sigla: 'Colher de Cha',
          taxa_conversao: 2.5,
          id_tipo_unidade: 2,
          id_ingrediente: 4
        },
        {
          id: 10,
          nome: 'Xicara (Farinha de Mandioca)',
          sigla: 'Xicara',
          taxa_conversao: 150,
          id_tipo_unidade: 2,
          id_ingrediente: 8
        },
        {
          id: 11,
          nome: 'Colher de Sopa (Farinha de Mandioca)',
          sigla: 'Colher de Sopa',
          taxa_conversao: 9,
          id_tipo_unidade: 2,
          id_ingrediente: 8
        },
        {
          id: 12,
          nome: 'Colher de Chá (Farinha de Mandioca)',
          sigla: 'Colher de Cha',
          taxa_conversao: 3,
          id_tipo_unidade: 2,
          id_ingrediente: 8
        },
        {
          id: 13,
          nome: 'Xicara (Farinha de Rosca)',
          sigla: 'Xicara',
          taxa_conversao: 80,
          id_tipo_unidade: 2,
          id_ingrediente: 9
        },
        {
          id: 14,
          nome: 'Colher de Sopa (Farinha de Rosca)',
          sigla: 'Colher de Sopa',
          taxa_conversao: 5,
          id_tipo_unidade: 2,
          id_ingrediente: 9
        },
        {
          id: 15,
          nome: 'Colher de Chá (Farinha de Rosca)',
          sigla: 'Colher de Cha',
          taxa_conversao: 1.5,
          id_tipo_unidade: 2,
          id_ingrediente: 9
        },
        {
          id: 16,
          nome: 'Xicara (Fubá)',
          sigla: 'Xicara',
          taxa_conversao: 120,
          id_tipo_unidade: 2,
          id_ingrediente: 10
        },
        {
          id: 17,
          nome: 'Colher de Sopa (Fubá)',
          sigla: 'Colher de Sopa',
          taxa_conversao: 7.5,
          id_tipo_unidade: 2,
          id_ingrediente: 10
        },
        {
          id: 18,
          nome: 'Colher de Chá (Fubá)',
          sigla: 'Colher de Cha',
          taxa_conversao: 2.5,
          id_tipo_unidade: 2,
          id_ingrediente: 10
        },
        {
          id: 19,
          nome: 'Xicara (Amido Milho)',
          sigla: 'Xicara',
          taxa_conversao: 150,
          id_tipo_unidade: 2,
          id_ingrediente: 5
        },
        {
          id: 20,
          nome: 'Colher de Sopa (Amido Milho)',
          sigla: 'Colher de Sopa',
          taxa_conversao: 9,
          id_tipo_unidade: 2,
          id_ingrediente: 5
        },
        {
          id: 21,
          nome: 'Colher de Chá (Amido Milho)',
          sigla: 'Colher de Cha',
          taxa_conversao: 3,
          id_tipo_unidade: 2,
          id_ingrediente: 5
        },
        {
          id: 22,
          nome: 'Xicara (Sal)',
          sigla: 'Xicara',
          taxa_conversao: 300,
          id_tipo_unidade: 2,
          id_ingrediente: 6
        },
        {
          id: 23,
          nome: 'Colher de Sopa (Sal)',
          sigla: 'Colher de Sopa',
          taxa_conversao: 13,
          id_tipo_unidade: 2,
          id_ingrediente: 6
        },
        {
          id: 24,
          nome: 'Colher de Chá (Sal)',
          sigla: 'Colher de Cha',
          taxa_conversao: 5,
          id_tipo_unidade: 2,
          id_ingrediente: 6
        },
        {
          id: 25,
          nome: 'Xicara (Açucar)',
          sigla: 'Xicara',
          taxa_conversao: 160,
          id_tipo_unidade: 2,
          id_ingrediente: 7
        },
        {
          id: 26,
          nome: 'Colher de Sopa (Açucar)',
          sigla: 'Colher de Sopa',
          taxa_conversao: 10,
          id_tipo_unidade: 2,
          id_ingrediente: 7
        },
        {
          id: 27,
          nome: 'Colher de Chá (Açucar)',
          sigla: 'Colher de Cha',
          taxa_conversao: 3.5,
          id_tipo_unidade: 2,
          id_ingrediente: 7
        },
        {
          id: 28,
          nome: 'Xicara (Achocolatado)',
          sigla: 'Xicara',
          taxa_conversao: 90,
          id_tipo_unidade: 2,
          id_ingrediente: 11
        },
        {
          id: 29,
          nome: 'Colher de Sopa (Achocolatado)',
          sigla: 'Colher de Sopa',
          taxa_conversao: 6,
          id_tipo_unidade: 2,
          id_ingrediente: 11
        },
        {
          id: 30,
          nome: 'Colher de Chá (Achocolatado)',
          sigla: 'Colher de Cha',
          taxa_conversao: 2,
          id_tipo_unidade: 2,
          id_ingrediente: 11
        },
        {
          id: 31,
          nome: 'Xicara (Arroz)',
          sigla: 'Xicara',
          taxa_conversao: 200,
          id_tipo_unidade: 2,
          id_ingrediente: 12
        },
        {
          id: 32,
          nome: 'Colher de Sopa (Arroz)',
          sigla: 'Colher de Sopa',
          taxa_conversao: 15,
          id_tipo_unidade: 2,
          id_ingrediente: 12
        },
        {
          id: 33,
          nome: 'Xicara (Feijão)',
          sigla: 'Xicara',
          taxa_conversao: 202,
          id_tipo_unidade: 2,
          id_ingrediente: 13
        },
        {
          id: 34,
          nome: 'Colher de Sopa (Feijão)',
          sigla: 'Colher de Sopa',
          taxa_conversao: 12.6,
          id_tipo_unidade: 2,
          id_ingrediente: 13
        },
        {
          id: 35,
          nome: 'Xicara (Mel)',
          sigla: 'Xicara',
          taxa_conversao: 340,
          id_tipo_unidade: 2,
          id_ingrediente: 14
        },
        {
          id: 36,
          nome: 'Colher de Sopa (Mel)',
          sigla: 'Colher de Sopa',
          taxa_conversao: 20,
          id_tipo_unidade: 2,
          id_ingrediente: 14
        },
        {
          id: 37,
          nome: 'Colher de Chá (Mel)',
          sigla: 'Colher de Cha',
          taxa_conversao: 8,
          id_tipo_unidade: 2,
          id_ingrediente: 14
        },
        {
          id: 38,
          nome: 'Xicara (Aveia)',
          sigla: 'Xicara',
          taxa_conversao: 80,
          id_tipo_unidade: 2,
          id_ingrediente: 15
        },
        {
          id: 39,
          nome: 'Colher de Sopa (Aveia)',
          sigla: 'Colher de Sopa',
          taxa_conversao: 5,
          id_tipo_unidade: 2,
          id_ingrediente: 15
        },
        {
          id: 40,
          nome: 'Colher de Chá (Aveia)',
          sigla: 'Colher de Cha',
          taxa_conversao: 1.5,
          id_tipo_unidade: 2,
          id_ingrediente: 15
        },
        {
          id: 41,
          nome: 'Xicara (Polvilho)',
          sigla: 'Xicara',
          taxa_conversao: 150,
          id_tipo_unidade: 2,
          id_ingrediente: 16
        },
        {
          id: 42,
          nome: 'Colher de Sopa (Polvilho)',
          sigla: 'Colher de Sopa',
          taxa_conversao: 9,
          id_tipo_unidade: 2,
          id_ingrediente: 16
        },
        {
          id: 43,
          nome: 'Colher de Chá (Polvilho)',
          sigla: 'Colher de Cha',
          taxa_conversao: 3,
          id_tipo_unidade: 2,
          id_ingrediente: 16
        },
        {
          id: 44,
          nome: 'Xicara (Coco Ralado)',
          sigla: 'Xicara',
          taxa_conversao: 80,
          id_tipo_unidade: 2,
          id_ingrediente: 17
        },
        {
          id: 45,
          nome: 'Colher de Sopa (Coco Ralado)',
          sigla: 'Colher de Sopa',
          taxa_conversao: 5,
          id_tipo_unidade: 2,
          id_ingrediente: 17
        },
        {
          id: 46,
          nome: 'Colher de Chá (Coco Ralado)',
          sigla: 'Colher de Cha',
          taxa_conversao: 1.5,
          id_tipo_unidade: 2,
          id_ingrediente: 17
        },
        {
          id: 47,
          nome: 'Colher de Sopa (Fermento em Pó)',
          sigla: 'Colher de Sopa',
          id_tipo_unidade: 2,
          id_ingrediente: 18,
          taxa_conversao: 10
        },
        {
          id: 48,
          nome: 'Colher de Chá (Fermento em Pó)',
          sigla: 'Colher de Cha',
          id_tipo_unidade: 2,
          id_ingrediente: 18,
          taxa_conversao: 4
        },
        {
          id: 49,
          nome: 'Xicara (Leite Condensado)',
          sigla: 'Xicara',
          id_tipo_unidade: 2,
          id_ingrediente: 20,
          taxa_conversao: 306
        },
        {
          id: 50,
          nome: 'Colher de Sopa (Leite Condensado)',
          sigla: 'Colher de Sopa',
          id_tipo_unidade: 2,
          id_ingrediente: 20,
          taxa_conversao: 19
        },
        {
          id: 51,
          nome: 'Xicara (Chocolate Granulado)',
          sigla: 'Xicara',
          id_tipo_unidade: 2,
          id_ingrediente: 21,
          taxa_conversao: 100
        },
        {
          id: 52,
          nome: 'Xicara (Margarina)',
          sigla: 'Xicara',
          id_tipo_unidade: 2,
          id_ingrediente: 23,
          taxa_conversao: 200
        },
        {
          id: 53,
          nome: 'Colher de Sopa (Margarina)',
          sigla: 'Colher de Sopa',
          id_tipo_unidade: 2,
          id_ingrediente: 23,
          taxa_conversao: 40
        },
        {
          id: 54,
          nome: 'Xicara (Manteiga)',
          sigla: 'Xicara',
          id_tipo_unidade: 2,
          id_ingrediente: 2,
          taxa_conversao: 200
        },
        {
          id: 55,
          nome: 'Colher de Sopa (Manteiga)',
          sigla: 'Colher de Sopa',
          id_tipo_unidade: 2,
          id_ingrediente: 2,
          taxa_conversao: 40
        },
        {
          id: 56,
          nome: 'Xicara',
          sigla: 'Xicara',
          id_tipo_unidade: 1,
          id_ingrediente: null,
          taxa_conversao: 0.24
        },
        {
          id: 57,
          nome: 'Colher de Sopa',
          sigla: 'Colher de Sopa',
          id_tipo_unidade: 1,
          id_ingrediente: null,
          taxa_conversao: 0.015
        },
        {
          id: 58,
          nome: 'Colher de Chá',
          sigla: 'Colher de Chá',
          id_tipo_unidade: 1,
          id_ingrediente: null,
          taxa_conversao: 0.005
        }
      ]);
    });
};
