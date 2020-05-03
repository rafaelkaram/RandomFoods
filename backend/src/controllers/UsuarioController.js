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
            var user = request.body[key];

            const { nome, email, senha } = user;
            const hash = crypto.createHmac('sha256', senha)
                .update('TADS')
                .digest('hex');
            const ativo = true;

            const [ id ] = await connection('usuario')
                .returning('id')
                .insert({
                    nome,
                    email,
                    senha,
                    ativo,
                });
            
            ids.push(id);

            console.log('Usuario inserido\nId: ' + id);
            console.log('Nome: ' + nome);
            console.log('\nSenha: ' + senha + ' || ' + hash);
            console.log('E-mail: ' + email + '\n');
        }

        return response.json(ids);
    },

    async createUnique(request, response) {
        const { nome, email, senha } = request.body;

        const hash = crypto.createHmac('sha256', senha)
            .update('TADS')
            .digest('hex');
        const ativo = true;

        const [ id ] = await connection('usuario')
            .returning('id')
            .insert({
                nome,
                email,
                senha,
                ativo,
            });

        console.log('Usuario inserido\nId: ' + id);
        console.log('Nome: ' + nome);
        console.log('\nSenha: ' + senha + ' || ' + hash);
        console.log('E-mail: ' + email + '\n');

        return response.json(id);
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