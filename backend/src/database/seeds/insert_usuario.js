exports.seed = function(knex) {
  return knex('usuario').del()
    .then(function () {
      return knex('usuario').insert([
        {
            nome: 'André Vitor Kuduavski',
            email: 'andre.kuduavski@ufpr.br',
            senha: 'tcc01'
        },
        {
            nome: 'Carlos Felipe Godinho Silva',
            email: 'cfelipe@ufpr.br',
            senha: 'tcc01'
        },
        {
            nome: 'Gleidson dos Santos Novais',
            email: 'gleidison.santos@ufpr.br',
            senha: 'tcc01'
        },
        {
            nome: 'Guilherme Vinicius Valério',
            email: 'guilhermevalerio@ufpr.br',
            senha: 'tcc01'
        },
        {
            nome: 'Rafael Henrique Karam',
            email: 'rafaelkaram@ufpr.br',
            senha: 'tcc01'
        }
      ]);
    });
};
