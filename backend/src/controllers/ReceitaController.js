const connection = require('../database/connection');

module.exports = {
    async index(request, response) {
        const receitas = await connection('receita')
            .innerJoin('usuario', 'receita.id_usuario', '=', 'usuario.id')
            .select('receita.*', 'usuario.nome as usuario')
            .orderBy('receita.data_cadastro');

        const resp = [];

        for (var key in receitas) {
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

        if (!obj) {
            return response.status(401).json({ error: 'Recipe not found.' });
        }

        const receita = await module.exports.findReceita(obj);

        return response.json(receita);
    },

    async fetch(request, response) {
        const user = request.headers.authorization;

        if (!user) {
            return response.status(401).json({ error: 'Operation not permitted.' });
        }

        const receitas = await connection('receita')
            .innerJoin('usuario', 'receita.id_usuario', '=', 'usuario.id')
            .where('id_usuario', user)
            .select('receita.*', 'usuario.nome as usuario')
            .orderBy('receita.data_cadastro');

        const resp = [];

        for (var key in receitas) {
            const obj = receitas[key];

            const receita = await module.exports.findReceita(obj);

            resp.push(receita);
        }

        return response.json(resp);
    },

    async createImport(request) {
        const { nome, descricao, tipo, ingredientes, categorias, user } = request;

        const trx = await connection.transaction();

        const [id] = await trx('receita')
            .returning('id')
            .insert({
                nome,
                descricao,
                tipo,
                ativa: true,
                id_usuario: user
            });

        const idsIngrediente = [];

        for (var key in ingredientes) {
            const ingrediente = ingredientes[key];

            const [idIngredienteReceita] = await trx('receita_ingrediente')
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

            const [idCategoria] = await trx('receita_categoria')
                .returning('id')
                .insert({
                    id_categoria: categoria,
                    id_receita: id
                });

            idsCategoria.push(idCategoria);
        }

        await trx.commit();

        return { id, ingredientes: idsIngrediente, categorias: idsCategoria };
    },

    async create(request, response) {
        const { nome, descricao, tipo, ingredientes, categorias } = request.body;

        const user = request.headers.authorization;

        if (!user) {
            return response.status(401).json({ error: 'Operation not permitted.' });
        }

        const trx = await connection.transaction();

        const [id] = await trx('receita')
            .returning('id')
            .insert({
                nome,
                descricao,
                tipo,
                ativa: true,
                id_usuario: user
            });

        const idsIngrediente = [];

        for (var key in ingredientes) {
            const ingrediente = ingredientes[key];

            const [idIngredienteReceita] = await trx('receita_ingrediente')
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

            const [idCategoria] = await trx('receita_categoria')
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

        if (!user || user_id != owner.id_usuario) {
            return response.status(401).json({ error: 'Operation not permitted.' });
        }

        const trx = connection.transaction();

        await trx('receita_categoria').where('id_receita', id).delete();
        await trx('receita_ingrediente').where('id_receita', id).delete();
        await trx('receita').where('id', id).delete();

        await trx.commit();

        return response.status(204).send();
    },

    async searchByIngredient(request, response) {
        const ids = []

        for (var key in request.body) {
            ids.push(request.body[key])
        }

        /*const idsR = await connection('receita_ingrediente')
            .whereIn('id_ingrediente', ids)
            .select('id_receita');*/

        const idsReceita = await connection.raw(`
        SELECT
            id_receita 
        FROM
            receita_ingrediente
        WHERE
            id_ingrediente IN (${ids})
        GROUP BY
            id_receita 
        HAVING count(*) = ${ids.length}`);

        /*const receitas = await connection('receita')
            .innerJoin('receita_ingrediente', 'receita_ingrediente.id_receita', '=', 'receita.id')
            .innerJoin('ingrediente', 'receita_ingrediente.id_ingrediente', '=', 'ingrediente.id')
            .whereIn('ingrediente.id', idsReceita)
            .select('receita.*');*/

        
        const ids2 = []
        for (var key in idsReceita.rows) {
            ids2.push(idsReceita.rows[key].id_receita)
        }

        const receitas = await connection('receita')
            .whereIn('id', ids2)
            .select('*')

        const resp = [];

        for (var key in receitas) {
            const obj = receitas[key];

            const receita = await module.exports.findReceita(obj);

            resp.push(receita);
        }

        return response.json(resp);
    },

    findReceita: async function (receita) {
        const listaIngredientes = await connection('receita_ingrediente')
            .innerJoin('ingrediente', 'receita_ingrediente.id_ingrediente', '=', 'ingrediente.id')
            .leftJoin('unidade', 'receita_ingrediente.id_unidade', '=', 'unidade.id')
            .where('receita_ingrediente.id_receita', receita.id)
            .select('receita_ingrediente.quantidade as quantidade',
                'ingrediente.id as ingrediente_id',
                'ingrediente.nome as ingrediente',
                'ingrediente.id_tipo_unidade as tipo_unidade',
                'unidade.nome as unidade',
                'unidade.sigla as sigla',
                'unidade.taxa_conversao as taxa',
                'unidade.id_ingrediente as temIngrediente');

        const ingredientes = [];

        for (var key in listaIngredientes) {
            const ingrediente = listaIngredientes[key];

            if (!ingrediente.quantidade || ingrediente.quantidade === 0 || !ingrediente.unidade) {
                ingredientes.push({ id: ingrediente.ingrediente_id, nome: ingrediente.ingrediente });
            } else {
                if (!ingrediente.tipo_unidade || !ingrediente.temIngrediente) {
                    ingredientes.push({
                        id: ingrediente.ingrediente_id,
                        nome: ingrediente.ingrediente,
                        quantidade: `${ingrediente.quantidade} ${ingrediente.sigla}`
                    });
                } else {
                    const unSI = await connection('unidade')
                        .where('id_tipo_unidade', ingrediente.tipo_unidade)
                        .andWhere('id_ingrediente', null)
                        .select('*');

                    for (var key2 in unSI) {
                        const un = unSI[key2];
                        const valor = (ingrediente.quantidade * (ingrediente.taxa)) / un.taxa_conversao;

                        if (valor > 1 && valor < 1000) {
                            ingredientes.push({
                                id: ingrediente.ingrediente_id,
                                nome: ingrediente.ingrediente,
                                quantidade: `${ingrediente.quantidade} ${ingrediente.sigla} ou ${valor}${un.sigla}`
                            });
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
            id: receita.id,
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