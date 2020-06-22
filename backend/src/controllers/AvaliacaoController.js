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

    async search(request, response) {
        const { id } = request.params;

        const { nome, nota, num_notas } = await connection('receita')
            .where('id', id)
            .first()
            .select([
                'nome',
                'nota',
                'num_notas'
            ]);

            console.log({ nome, nota, num_notas });

        const avaliacoes = await connection('avaliacao')
            .join('usuario', 'usuario.id', '=', 'avaliacao.id_usuario')
            .where('id_receita', id)
            .select([
                'avaliacao.valor as nota',
                'avaliacao.data',
                'usuario.nome as usuario',
            ]);

        return response.json({
            receita: nome,
            nota,
            count: num_notas,
            avaliacoes
        });
    },

    async create(request, response) {
        const { id_receita, id_usuario } = request.params;
        const { valor } = request.body;

        const trx = await connection.transaction();

        const [ id ] = await trx('avaliacao')
            .returning('id')
            .insert({
                id_usuario,
                id_receita,
                valor
            });

        const { nota, num_notas } = await trx('receita')
            .where('id', id_receita)
            .first()
            .select([
                'nota',
                'num_notas'
            ]);

            console.log({ nota, num_notas });

        if (num_notas != 0)  {
            const novaNota = ((nota * num_notas) + valor) / (num_notas + 1);
            const novoNum = num_notas + 1;
            console.log('Entrou na média.');

            await trx('receita')
                .where('id', id_receita)
                .update({
                    nota: novaNota,
                    num_notas: novoNum
                });
        } else {
            console.log('Entrou na atribuição');
            await trx('receita')
                .where('id', id_receita)
                .update({
                    nota: valor,
                    num_notas: 1
                });
        }

        await trx.commit();
        
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