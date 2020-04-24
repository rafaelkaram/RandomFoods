const connection = require('../database/connection');
const crypto = require('crypto');

module.exports = {
    async index(request, response) {
        const users = await connection('usuario').select('*').orderBy('id');

        return response.json(users);
    },

    async create(request, response) {
        const { nome, email, senha } = request.body;
        // const id = crypto.randomBytes(4).toString('HEX');
        const data = new Date();
        const ativo = true;

        const [ id ] = await connection('usuario')
            .returning('id')
            .insert({
                nome,
                email,
                senha,
                ativo,
            });

        return response.json({ id });
    },

    async delete(request, response) {
        const { id } = request.params;
        const user_id = request.headers.authorization;

        const user = await connection('usuario')
            .where('id', user_id)
            .select('id')
            .first();

        if (user_id != user.id) {
            return response.status(401).json({ error: 'Operation not permitted.' });
        }

        await connection('usuario').where('id', id).delete();

        return response.status(204).send();
    }
}