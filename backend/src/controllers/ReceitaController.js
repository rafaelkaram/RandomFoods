const connection = require('../database/connection');

module.exports = {
    async index(request, response) {
        const receitas = await connection('receita')
            .innerJoin('usuario', 'receita.id_usuario', '=', 'usuario.id')
            .select('receita.*', 'usuario.nome as usuario')
            .orderBy('receita.data_cadastro');

        const resp = [];

        for ( var key in receitas ) {
            const obj = receitas[key];

            const receita = await module.exports.findReceita(obj);

            resp.push(receita);
        }

        return response.json(resp);
    },

    async search(request, response) {
        const { id } = request.params;

        const obj = await connection('receita')
            .innerJoin('usuario', 'receita.id_usuario', '=', 'usuario.id')
            .where('receita.id', id)
            .select('receita.*', 'usuario.nome as usuario')
            .first();

        if ( !obj ) {
            return response.status(401).json({ error: 'Recipe not found.' });
        }

        console.log(obj.descricao);

        const receita = await module.exports.findReceita(obj);

        return response.json(receita);
    },

    async fetch(request, response) {
        const user = request.headers.authorization;

        if ( !user ) {
            return response.status(401).json({ error: 'Operation not permitted.' });
        }

        const receitas = await connection('receita')
            .innerJoin('usuario', 'receita.id_usuario', '=', 'usuario.id')
            .where('id_usuario', user)
            .select('receita.*', 'usuario.nome as usuario')
            .orderBy('receita.data_cadastro');

        const resp = [];

        for ( var key in receitas ) {
            const obj = receitas[key];

            const receita = await module.exports.findReceita(obj);

            resp.push(receita);
        }

        return response.json(resp);
    },

    async create(request, response) {
        const { nome, descricao, tipo, ingredientes, categorias } = request.body;
        const user = request.headers.authorization;

        if ( !user ) {
            return response.status(401).json({ error: 'Operation not permitted.' });
        }

        const trx = await connection.transaction();

        const [ id ] = await trx('receita')
            .returning('id')
            .insert({
                nome,
                descricao: descricao.replace(/\n/g, "<br />"),
                tipo,
                ativa : true,
                id_usuario : user
            });

        const idsIngrediente = [];

        for (var key in ingredientes) {
            const ingrediente = ingredientes[key];

            const [ idIngredienteReceita ] = await trx('receita_ingrediente')
                .returning('id')
                .insert({
                    id_ingrediente: ingrediente.id,
                    id_receita: id,
                    id_unidade: ingrediente.id_unidade,
                    quantidade: ingrediente.quantidade ? ingrediente.quantidade : null
                });

            if (!idIngredienteReceita) {

            }

            idsIngrediente.push(idIngredienteReceita);
        }

        const idsCategoria = [];

        for (var key in categorias) {
            const categoria = categorias[key];

            const [ idCategoria ] = await trx('receita_categoria')
                .returning('id')
                .insert({
                    id_categoria: categoria,
                    id_receita: id
                });

            idsCategoria.push(idCategoria);
        }

        await trx.commit();

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

        const trx = connection.transaction();

        await trx('receita_categoria').where('id_receita', id).delete();
        await trx('receita_ingrediente').where('id_receita', id).delete();
        await trx('receita').where('id', id).delete();

        await trx.commit();

        return response.status(204).send();
    },

    findReceita: async function (receita) { 
        const listaIngredientes = await connection('receita_ingrediente')
            .innerJoin('ingrediente', 'receita_ingrediente.id_ingrediente', '=', 'ingrediente.id')
            .leftJoin('unidade', 'receita_ingrediente.id_unidade', '=', 'unidade.id')
            .where('receita_ingrediente.id_receita', receita.id)
            .select('receita_ingrediente.quantidade as quantidade',
                'ingrediente.nome as ingrediente',
                'ingrediente.id_tipo_unidade as tipo_unidade',
                'unidade.nome as unidade',
                'unidade.sigla as sigla',
                'unidade.taxa_conversao as taxa',
                'unidade.id_ingrediente as temIngrediente');

        const ingredientes = [];

        for(var key in listaIngredientes) {
            const ingrediente = listaIngredientes[key];

            if (!ingrediente.quantidade || ingrediente.quantidade === 0 || !ingrediente.unidade) {
                ingredientes.push({ nome: ingrediente.ingrediente });
            } else {
                if (!ingrediente.tipo_unidade || !ingrediente.temIngrediente) {
                    ingredientes.push({ nome: ingrediente.ingrediente, quantidade: `${ingrediente.quantidade} ${ingrediente.sigla}`});
                } else {
                    const unSI = await connection('unidade')
                        .where('id_tipo_unidade', ingrediente.tipo_unidade)
                        .andWhere('id_ingrediente', null)
                        .select('*');

                    for (var key2 in unSI) {
                        const un = unSI[key2];
                        const valor = (ingrediente.quantidade * (ingrediente.taxa)) / un.taxa_conversao;

                        if (valor > 1 && valor < 1000) {
                            ingredientes.push({ nome: ingrediente.ingrediente, quantidade: `${ingrediente.quantidade} ${ingrediente.sigla} ou ${valor}${un.sigla}`});
                            break;
                        }
                    }
                }
            }
        }
            
        const categorias = [];

        const listaCategoria = await connection('receita_categoria')
            .innerJoin('categoria', 'receita_categoria.id_categoria', '=', 'categoria.id')
            .where('receita_categoria.id_receita', receita.id)
            .select('categoria.nome');

        for (var key in listaCategoria) {
            const categoria = listaCategoria[key];

            categorias.push(categoria.nome);
        }
            
        return {
            receita: receita.nome,
            descricao: receita.descricao,
            tipo: receita.tipo,
            usuario: receita.usuario,
            dataCadastro: receita.data_cadastro,
            ativa: receita.ativa,
            nota: receita.nota,
            ingredientes,
            categorias
        };
    }
}