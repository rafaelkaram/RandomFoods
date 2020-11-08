const connection = require('../database/connection');

module.exports = {
  async index(request, response) {
    const categorias = await connection('categoria').select('*').orderBy('id');

    return response.json(categorias);
  },

  async fetch(nome) {
    const categoria = await connection('categoria')
        .whereRaw('LOWER("nome") = ?', nome.toLowerCase())
        .select('*')
        .first();

    return categoria;
  }
}