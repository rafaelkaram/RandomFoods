const connection = require('../database/connection');
const crypto = require('crypto');

module.exports = {
    async userIndex(request, response) {
        const { page = 1 } = request.query;
        const user_id = request.headers.authorization;
        const avaliacao = await connection('avaliacao')
            .join('receita', 'receita.id', '=', 'avaliacao.id_receita')
            .limit(5)
            .offset((page - 1)*5)
            .select([
                'avaliacao.id',
                'avaliacao.valor',
                'avaliacao.data',
                'receita.nome',
                'receita.descricao',
                'receita.tipo',
                'receita.data_cadastro',
            ]);

        const [ qtde ] = await connection('avaliacao')
            .count();

        console.log(qtde);

        response.header('X-Total-Count', qtde['count']);

        return response.json(avaliacao);
    },

    async create(request, response) {
        const { id_receita } = request.params;
        const { valor } = request.body;
        const id_usuario = request.headers.authorization;
        const data = new Date();

        const [ id ] = await connection('avaliacao')
            .returning('id')
            .insert({
                id_usuario,
                id_receita,
                valor,
                data
            });

        return response.json({ id });
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