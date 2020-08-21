exports.seed = function(knex) {
  return knex('usuario').del()
    .then(function () {
      return knex('usuario').insert([
        {
            nome: 'André Vitor Kuduavski',
            email: 'andre.kuduavski@ufpr.br',
            senha: 'a650c7c95f7121a6610bc92654db19bd558d3f4e5e143232abef8be65bf6c846'
        },
        {
            nome: 'Carlos Felipe Godinho Silva',
            email: 'cfelipe@ufpr.br',
            senha: 'a650c7c95f7121a6610bc92654db19bd558d3f4e5e143232abef8be65bf6c846'
        },
        {
            nome: 'Gleidson dos Santos Novais',
            email: 'gleidison.santos@ufpr.br',
            senha: 'a650c7c95f7121a6610bc92654db19bd558d3f4e5e143232abef8be65bf6c846'
        },
        {
            nome: 'Guilherme Vinicius Valério',
            email: 'guilhermevalerio@ufpr.br',
            senha: 'a650c7c95f7121a6610bc92654db19bd558d3f4e5e143232abef8be65bf6c846'
        },
        {
            nome: 'Rafael Henrique Karam',
            email: 'rafaelkaram@ufpr.br',
            senha: 'a650c7c95f7121a6610bc92654db19bd558d3f4e5e143232abef8be65bf6c846'
        }
      ]);
    });
};
