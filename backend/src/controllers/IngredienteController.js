const connection = require('../database/connection');
const crypto = require('crypto');

module.exports = {
    async index(request, response) {
        const users = await connection('usuario').select('*').orderBy('id');

        return response.json(users);
    },
    
    async create(request, response) {
        const ids = [];
        for (var key in request.body) {
            const unidade = request.body[key];

            const { nome, id_tipo_unidade, sem_medida, derivado_leite, gluten } = unidade;            

            const [ id ] = await connection('ingrediente')
                .returning('id')
                .insert({
                    nome,
                    id_tipo_unidade,
                    sem_medida,
                    derivado_leite,
                    gluten
                });

            ids.push(id);

            console.log('Ingrediente inserido\nId: ' + id);
            console.log('Nome: ' + nome);
            console.log('Medida única')
        }

        return response.json(ids);
    },

    async delete(request, response) {
        const { id } = request.params;
        const user_id = request.headers.authorization;

        const user = await connection('usuario')
            .where('id', id)
            .select('id')
            .first();

        if (user_id != user.id) {
            return response.status(401).json({ error: 'Operation not permitted.' });
        }

        await connection('usuario').where('id', id).delete();

        return response.status(204).send();
    }
}