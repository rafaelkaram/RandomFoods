const connection = require('../database/connection');

module.exports = {
    async index(request, response) {
        const users = await connection('unidade').select('*').orderBy('id');

        return response.json(users);
    },

    async create(request, response) {
        const { nome, id_tipo_unidade } = request.body;

        const [ id ] = await connection('unidade')
            .returning('id')
            .insert({
                nome,
                id_tipo_unidade,
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

        await connection('unidade').where('id', id).delete();

        return response.status(204).send();
    }
}