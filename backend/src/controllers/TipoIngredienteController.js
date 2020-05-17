const connection = require('../database/connection');

module.exports = {
    async index(request, response) {
        const tipo_ingrediente = await connection('tipo_ingrediente').select('*').orderBy('id');

        return response.json(tipo_ingrediente);
    },

    async list(request, response) {
        const tipo_ingredientes = await connection('tipo_ingrediente').select('*').orderBy('id');
        const list = [];
        for (const key in tipo_ingredientes) {
            const tipo_ingrediente = tipo_ingredientes[key];

            list.push({ value: tipo_ingrediente.id, label: tipo_ingrediente.nome });
        }

        return response.json(list);
    },

    async search(request, response) {
        const { id } = request.params;
        const tu = await connection('tipo_ingrediente')
            .where('id', id)
            .select('*')
            .first();

        if (!tu) {
            return response.status(400).json({ error: 'Tipo Unidade não encontrada!'});
        }

        return response.json(tu);
    },

    async create(request, response) {

        const item = request.body;

        const { nome } = item;

        const [ id ] = await connection('tipo_ingrediente')
            .returning('id')
            .insert({
                nome
            });

        return response.status(200).json({ id });
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

        await connection('tipo_ingrediente').where('id', id).delete();

        return response.status(204).send();
    }
}