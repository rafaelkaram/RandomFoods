const connection = require('../database/connection');

module.exports = {
    async index(request, response) {
        const users = await connection('receita').select('*').orderBy('id');

        return response.json(users);
    },

    async search(request, response) {
        const id = request.params;
        
        if ( !id ) {
            return response.status(401).json({ error: 'Recipe not found.' });
        }

        return response.json('vá se fude');
    },

    async fetch(request, response) {
        const user = request.headers.authorizationId;

        if ( !user ) {
            return response.status(401).json({ error: 'Operation not permitted.' });
        }



        return;
    },

    async create(request, response) {
        const { nome, descricao, tipo, ingredientes, categorias } = request.body;
        const user = request.headers.authorizationId;

        if ( !user ) {
            return response.status(401).json({ error: 'Operation not permitted.' });
        }

        const [ id ] = await connection('receita')
            .returning('id')
            .insert({
                nome,
                descricao,
                tipo,
                ativa : true,
                id_usuario : user
            });

        const idsIngrediente = [];

        for (var key in ingredientes) {
            const ingrediente = ingredientes[key];

            const [ idIngrediente ] = await connection('receita_ingrediente')
                .returning('id')
                .insert({
                    id_ingrediente: ingrediente.id,
                    id_receita: id,
                    id_unidade: ingrediente.id_unidade,
                    quantidade: ingrediente.quantidade
                });

            idsIngrediente.push(idIngrediente);
        }

        const idsCategoria = [];

        for (var key in categorias) {
            const categoria = categorias[key];

            const [ idCategoria ] = await connection('receita_categoria')
                .returning('id')
                .insert({
                    id_ingrediente: categoria.id,
                    id_receita: id
                });

            idsCategoria.push(idCategoria);
        }

        return response.json({ id, ingredientes: idsIngrediente, categorias: idsCategoria });
    },

    async delete(request, response) {
        const { id } = request.params;
        const user_id = request.headers.authorization;

        const user = await connection('usuario')
            .where('id', user_id)
            .select('id')
            .first();

        const owner = await connection('receita')
            .where('id', id)
            .select('id_usuario')
            .first();

        if ( !user || user_id != owner.id_usuario) {
            return response.status(401).json({ error: 'Operation not permitted.' });
        }

        await connection('receita_categoria').where('id_receita', id).delete();
        await connection('receita_ingrediente').where('id_receita', id).delete();
        await connection('receita').where('id', id).delete();

        return response.status(204).send();
    }, 

    findUnits: async function (id_origem, id_destino) { 
        const unidade_origem = await connection('unidade')
            .where('id', id_origem)
            .select('*')
            .first();

        const unidade_destino = await connection('unidade')
            .where('id', id_destino)
            .select('*')
            .first();

        return { unidade_origem, unidade_destino };
    }
}