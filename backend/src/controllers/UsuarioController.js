const connection = require('../database/connection');
const crypto = require('crypto');

module.exports = {
    async index(request, response) {
        const users = await connection('usuario').select('*');

        return response.json(users);
    },

    async create(request, response) {
        const { nome, email, senha } = request.body;
        // const id = crypto.randomBytes(4).toString('HEX');
        const data = new Date();

        const [ id ] = await connection('usuario').insert({
            nome,
            email,
            senha,
            data,
            data,
            data,
            ativo,
        });

        return response.json({ id });
    }
}