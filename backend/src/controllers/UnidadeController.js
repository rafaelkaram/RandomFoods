const connection = require('../database/connection');

module.exports = {
    async index(request, response) {
        const users = await connection('unidade').select('*').orderBy('id');

        return response.json(users);
    },

    async search(request, response) {
        const id = request.params;
        const [ unit ] = await connection('unidade')
            .where('id', id)
            .select('*')
            .orderBy('id');

        return response.json(unit);
    },

    async create(request, response) {
        const ids = [];
        for (var key in request.body) {
            const un = request.body;

            const { nome, sigla, tipo_unidade, si, taxa_conversao } = un;

            const [ unidade ] = await connection('unidade')
            .where('id', id)
            .select('*')
            .orderBy('id');


            const [ id ] = await connection('unidade')
                .returning('id')
                .insert({
                    nome,
                    sigla,
                    id_tipo_unidade,
                    si,
                    taxa_conversao
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