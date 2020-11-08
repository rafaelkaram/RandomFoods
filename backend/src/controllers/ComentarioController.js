const connection = require('../database/connection');
const crypto = require('crypto');
const { search } = require('./ReceitaController');

module.exports = {
    async index(request, response) {
        const comentarios = await connection('comentario')
        .join('avaliacao', 'avaliacao.id_receita', '=', 'comentario.id_receita')
        .select([
            'comentario.*',
            'avaliacao.valor'
        ])
        .orderBy('comentario.id');

        return response.json(comentarios);
    },

    async search(request, response) {
        const { id } = request.params;

        const comentarios = await connection('comentario')
            .innerJoin('usuario', 'usuario.id', '=', 'comentario.id_usuario')
            .leftOuterJoin('avaliacao', function () {
                this
                  .on('comentario.id_usuario', 'avaliacao.id_usuario')
                  .on('comentario.id_receita', 'avaliacao.id_receita');
              })
            .whereNull('comentario.id_pai')
            //.where('comentario.id_pai', 0)
            .andWhere('comentario.id_receita', id)
            .select([
                'usuario.nome as usuario',
                'comentario.*',
                'avaliacao.valor as avaliacao'
            ]);

        const filhos = await connection('comentario')
            .innerJoin('usuario', 'usuario.id', '=', 'comentario.id_usuario')
            .leftOuterJoin('avaliacao', function () {
                this
                  .on('comentario.id_usuario', 'avaliacao.id_usuario')
                  .on('comentario.id_receita', 'avaliacao.id_receita');
              })
            .whereNotNull('comentario.id_pai')
            //.whereNot('comentario.id_pai', 0)
            .andWhere('comentario.id_receita', id)
            .select([
                'usuario.nome as usuario',
                'comentario.*',
                'avaliacao.valor as avaliacao'
            ]);

        if (filhos)
            return response.json({ comentarios, filhos });
        else
            return response.json({ comentarios });
    },

    async create(request, response) {
        const { id_receita, id_usuario } = request.params;
        const { comentario, id_pai } = request.body;

        const [ id ] = await connection('comentario')
            .returning('id')
            .insert({
                id_usuario,
                id_receita,
                'id_pai': id_pai === undefined ? 0 : id_pai,
                'valor': comentario,
            });

        const nome = await connection('usuario')
            .where('id', id_usuario)
            .first()
            .select('nome');

        return response.json({ id, nome, comentario });
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