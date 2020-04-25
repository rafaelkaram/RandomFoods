const connection = require('../database/connection');

module.exports = {
    async index(request, response) {
        const users = await connection('unidade').select('*').orderBy('id');

        return response.json(users);
    },

    async search(request, response) {
        const id = request.params;
        const unidade = await connection('unidade')
            .where('id', id)
            .select('*')
            .first();

        if (!unidade) {
            return response.status(400).json({ error: 'Unidade não encontrada!'});
        }

        return response.json(unidade);
    },

    async create(request, response) {
        const ids = [];
        for (var key in request.body) {
            const unidade = request.body[key];

            const { nome, sigla, id_tipo_unidade, id_ingrediente, taxa_conversao } = unidade;            

            const [ id ] = await connection('unidade')
                .returning('id')
                .insert({
                    nome,
                    sigla,
                    id_tipo_unidade,
                    id_ingrediente,
                    taxa_conversao
                });

            ids.push(id);

            console.log('Unidade inserida\nId: ' + id);
            console.log('Nome: ' + nome);
            console.log('Sigla: ' + sigla);
            console.log('Taxa de Conversão' + taxa_conversao + '\n');
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