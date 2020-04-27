const connection = require('../database/connection');

module.exports = {
    async index(request, response) {
        const tipo_unidade = await connection('tipo_unidade').select('*').orderBy('id');

        return response.json(tipo_unidade);
    },

    async search(request, response) {
        const { id } = request.params;
        const tu = await connection('tipo_unidade')
            .where('id', id)
            .select('*')
            .first();

        if (!tu) {
            return response.status(400).json({ error: 'Tipo Unidade não encontrada!'});
        }

        return response.json(tu);
    },

    async create(request, response) {
        const ids = [];
        for (var key in request.body) {
            const item = request.body[key];

            const { nome } = item;

            const [ id ] = await connection('tipo_unidade')
                .returning('id')
                .insert({
                    nome
                });

            ids.push(id);

        }

        return response.json(ids);
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