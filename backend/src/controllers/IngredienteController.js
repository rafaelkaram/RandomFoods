const connection = require('../database/connection');

module.exports = {
    async index(request, response) {
        const ingredients = await connection('ingrediente').select('*').orderBy('nome');
        return response.json(ingredients);
    },

    async search(request, response) {
        const { id } = request.params;
        const ingrediente = await connection('ingrediente')
            .where('id', id)
            .select('*')
            .first();

        if (!ingrediente) {
            return response.status(400).json({ error: 'Ingrediente não encontrado!'});
        }

        return response.json(ingrediente);
    },

    async fetch(nome) {
        const ingrediente = await connection('ingrediente')
            .whereRaw('LOWER("nome") = ?', nome.toLowerCase())
            .select('*')
            .first();

        return ingrediente;
    },

    async createIngredient(request, response) {
        const ingrediente = request.body;

        var { nome, id_tipo_unidade, sem_medida, derivado_leite, gluten,id_tipo_ingrediente } = ingrediente;

        console.log(sem_medida);

        if (!sem_medida) {
            sem_medida = false;
        }
        if (!gluten) {
            gluten = false;
        }
        if (!derivado_leite) {
            derivado_leite = false;
        }

        const [ id ] = await connection('ingrediente')
            .returning('id')
            .insert({
                nome,
                id_tipo_unidade,
                sem_medida,
                derivado_leite,
                gluten,
                id_tipo_ingrediente
            });


        console.log('Ingrediente inserido\nId: ' + id);
        console.log('Nome: ' + nome);
        console.log('Medida única: ' + sem_medida);
        console.log('E vaca: ' + derivado_leite);
        console.log('Possui Gluten: ' + gluten);

        return response.json(id);

    },

    async create(request, response) {
        const ids = [];
        for (var key in request.body) {
            const ingrediente = request.body[key];

            var { id, nome, id_tipo_unidade, sem_medida, derivado_leite, gluten ,id_tipo_ingrediente} = ingrediente;
            if (!sem_medida) {
                sem_medida = false;
            }
            if (!gluten) {
                gluten = false;
            }
            if (!derivado_leite) {
                derivado_leite = false;
            }

            const [ id_ingrediente ] = await connection('ingrediente')
                .returning('id')
                .insert({
                    id,
                    nome,
                    id_tipo_unidade,
                    sem_medida,
                    derivado_leite,
                    gluten,
                    id_tipo_ingrediente
                });

            ids.push(id);

            console.log('Ingrediente inserido\nId: ' + id);
            console.log('Nome: ' + nome);
            console.log('Medida única: ' + sem_medida);
            console.log('E vaca: ' + derivado_leite);
            console.log('Possui Gluten: ' + gluten);
        }

        return response.json(ids);
    },

    async delete(request, response) {
        const { id } = request.params;
        const user_id = request.headers.authorization;

        const user = await connection('ingrediente')
            .where('id', id)
            .select('id')
            .first();

        if (user_id != user.id) {
            return response.status(401).json({ error: 'Operation not permitted.' });
        }

        await connection('ingrediente').where('id', id).delete();

        return response.status(204).send();
    },

    async ingredientType( request,response ){
        const ingredientType = await connection('tipo_ingrediente')
        .select('*');

        const json = [];

        for( var key in ingredientType ){
            const type = ingredientType[key];
            const ingredient = await connection('ingrediente')
            .where('id_tipo_ingrediente', '=' , type.id)
            .select('*')
            .orderBy('nome');

            json.push({
                tipo: type.nome,
                image_url: 'http://localhost:3333/ingredient-types/',
                ingredientes : ingredient
            });
        }

        return response.json(json);
    }

}