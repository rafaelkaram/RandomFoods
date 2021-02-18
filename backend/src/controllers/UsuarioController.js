const connection = require('../database/connection');
const crypto = require('crypto');
const { request } = require('http');
const factor = 'TADS';

module.exports = {
    async index(request, response) {
        const users = await connection('usuario').select('*').orderBy('id');

        return response.json(users);
    },

    async validate(request, response) {
        const { email , senha } = request.body;
        const user = await connection('usuario')
            .where('email', email)
            .select('*')
            .first();

        const hash = crypto.createHmac('sha256', senha)
            .update(factor)
            .digest('hex');

        console.log({ email, senha, hash, user });

        if (!user || user.senha != hash) {
            return response.status(400).json({ error: 'Usuario ou senha inválidos!'});
        }

        return response.json(user);
    },

    async create(request, response) {
        const ids = [];
        for (var key in request.body) {
            var user = request.body[key];

            const { nome, email, senha } = user;
            const hash = crypto.createHmac('sha256', senha)
                .update(factor)
                .digest('hex');
            const ativo = true;

            const [ id ] = await connection('usuario')
                .returning('id')
                .insert({
                    nome,
                    email,
                    senha : hash,
                    ativo,
                });

            ids.push(id);

            console.log('Usuario inserido\nId: ' + id);
            console.log('Nome: ' + nome);
            console.log('Senha: ' + senha + ' || ' + hash);
            console.log('E-mail: ' + email + '\n');
        }

        return response.json(ids);
    },

    async createUnique(request, response) {
        const { nome, email, senha } = request.body;

        const hash = crypto.createHmac('sha256', senha)
            .update(factor)
            .digest('hex');
        const ativo = true;

        const [ id ] = await connection('usuario')
            .returning('id')
            .insert({
                nome,
                email,
                senha: hash,
                ativo,
            });

        console.log('Usuario inserido\nId: ' + id);
        console.log('Nome: ' + nome);
        console.log('Senha: ' + senha + ' || ' + hash);
        console.log('E-mail: ' + email + '\n');

        return response.json(id);
    },

    async findByEmail(email) {
        try {
            const user = await connection('usuario')
                .where('email', email)
                .select('*')
                .first();

            return user;
        } catch (error) {
            return null;
        }
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
    },

    async recipeType(request, response){
        
        const { id } = request.params

        const recipes = await connection('receita')
        .where('id_usuario',id)
        .select('tipo')
        .count('*')
        .groupBy('tipo') 

        return response.json(recipes)

    },

    async recipeCategory(resquest, response){

        const { id } = resquest.params

        const recipes = await connection('receita')
        .leftJoin('receita_categoria','receita.id', '=', 'receita_categoria.id_receita')
        .leftJoin('categoria', 'receita_categoria.id_categoria', '=', 'categoria.id')
        .where('receita.id_usuario',id)
        .select('categoria.nome as nome_categoria')
        .count('*')
        .groupBy('categoria.nome')

        return response.json(recipes)
    },

    async topVotedRecipe(request, response){

        const { id } = request.params

        const recipes = await connection('receita')
        .where('id_usuario',id)
        .andWhere('nota','>', '0')
        .select('id','nome','nota','num_notas')

        return response.json(recipes)
    }

}