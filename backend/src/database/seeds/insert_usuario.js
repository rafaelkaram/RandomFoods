exports.seed = function(knex) {
  return knex('usuario').del()
    .then(function () {
      return knex('usuario').insert([
        {
            nome: 'André Vitor Kuduavski',
            email: 'andre.kuduavski@ufpr.br',
            senha: '7d52f1dad957cc83a1b2e74977502087a51442de6c46acb9892b8b9542d5cc40'
        },
        {
            nome: 'Carlos Felipe Godinho Silva',
            email: 'cfelipe@ufpr.br',
            senha: '7d52f1dad957cc83a1b2e74977502087a51442de6c46acb9892b8b9542d5cc40'
        },
        {
            nome: 'Gleidson dos Santos Novais',
            email: 'gleidison.santos@ufpr.br',
            senha: '7d52f1dad957cc83a1b2e74977502087a51442de6c46acb9892b8b9542d5cc40'
        },
        {
            nome: 'Guilherme Vinicius Valério',
            email: 'guilhermevalerio@ufpr.br',
            senha: '7d52f1dad957cc83a1b2e74977502087a51442de6c46acb9892b8b9542d5cc40'
        },
        {
            nome: 'Rafael Henrique Karam',
            email: 'rafaelkaram@ufpr.br',
            senha: '7d52f1dad957cc83a1b2e74977502087a51442de6c46acb9892b8b9542d5cc40'
        }
      ]);
    });
};
