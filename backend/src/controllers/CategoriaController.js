const connection = require('../database/connection');

module.exports = {
  async index(request, response) {
    const categorias = await connection('categoria').select('*').orderBy('id');

    return response.json(categorias);
  }
}